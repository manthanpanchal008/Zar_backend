const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { 
  findUserByEmail, 
  updateUserOtp, 
  updateUserResetToken, 
  resetUserPassword 
} = require('../models/userModel');
const { getSafeUserFromDbRow, signAdminToken } = require('../middleware/auth');
const { sendOtpEmail } = require('../services/mailService');

const isProduction = process.env.NODE_ENV === 'production';

function normalizeBcryptHash(hash) {
  if (typeof hash === 'string' && hash.startsWith('$2y$')) {
    return '$2b$' + hash.slice(4);
  }
  return hash;
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  try {
    const user = await findUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, normalizeBcryptHash(user.password));
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const safeUser = getSafeUserFromDbRow(user);
    const token = signAdminToken(user);

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('JWT login error:', error);
    return res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
}

function me(req, res) {
  return res.json({ success: true, user: req.user });
}

function logout(_req, res) {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  return res.json({ success: true, message: 'Logged out successfully.' });
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'This email is not registered in our system.' 
      });
    }

    const now = new Date();
    
    // Check cooldown / rate limits
    if (user.reset_otp_last_sent) {
      const lastSent = new Date(user.reset_otp_last_sent);
      const diffMs = now - lastSent;
      
      // 1. Cooldown of 60 seconds
      if (diffMs < 60 * 1000) {
        const waitSec = Math.ceil((60 * 1000 - diffMs) / 1000);
        return res.status(429).json({ 
          success: false, 
          error: `Please wait ${waitSec} seconds before requesting a new code.` 
        });
      }

      // 2. Cooldown of 15 minutes for 5 requests
      const isWithin15Min = diffMs < 15 * 60 * 1000;
      if (isWithin15Min && user.reset_otp_attempts >= 5) {
        const waitMin = Math.ceil((15 * 60 * 1000 - diffMs) / (60 * 1000));
        return res.status(429).json({ 
          success: false, 
          error: `Too many password reset requests. Please try again in ${waitMin} minutes.` 
        });
      }
    }

    // Reset attempts if the window has expired
    let newAttempts = 1;
    if (user.reset_otp_last_sent) {
      const lastSent = new Date(user.reset_otp_last_sent);
      if (now - lastSent < 15 * 60 * 1000) {
        newAttempts = (user.reset_otp_attempts || 0) + 1;
      }
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes validity

    // Store in DB
    await updateUserOtp(normalizedEmail, {
      reset_otp: otp,
      reset_otp_expiry: expiry,
      reset_otp_attempts: newAttempts,
      reset_otp_last_sent: now
    });

    // Send email
    try {
      await sendOtpEmail(normalizedEmail, user.name || 'User', otp, 15);
    } catch (mailError) {
      console.error('Mail delivery failure:', mailError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send verification code. Please try again later.' 
      });
    }

    return res.json({ 
      success: true, 
      message: 'If your email is registered, we have sent a secure 6-digit verification code.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, error: 'An unexpected error occurred. Please try again.' });
  }
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }
  if (!otp || !otp.trim()) {
    return res.status(400).json({ success: false, error: 'Verification code is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await findUserByEmail(normalizedEmail);
    if (!user || !user.reset_otp) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification code.' });
    }

    const now = new Date();
    const expiry = new Date(user.reset_otp_expiry);

    if (now > expiry) {
      return res.status(400).json({ success: false, error: 'Verification code has expired. Please request a new one.' });
    }

    if (user.reset_otp !== otp.trim()) {
      return res.status(400).json({ success: false, error: 'Invalid verification code.' });
    }

    // OTP verified successfully. Generate a single-use secure reset token.
    const resetToken = crypto.randomBytes(32).toString('hex');
    await updateUserResetToken(normalizedEmail, resetToken);

    return res.json({ 
      success: true, 
      message: 'Code verified successfully.',
      resetToken 
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, error: 'An unexpected error occurred. Please try again.' });
  }
}

async function resetPassword(req, res) {
  const { email, resetToken, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }
  if (!resetToken || !resetToken.trim()) {
    return res.status(400).json({ success: false, error: 'Reset authorization token is missing.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await findUserByEmail(normalizedEmail);
    if (!user || !user.reset_token || user.reset_token !== resetToken.trim()) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset session token.' });
    }

    // Hash password and reset OTP/token fields
    const hashedPassword = await bcrypt.hash(password, 10);
    await resetUserPassword(normalizedEmail, hashedPassword);

    return res.json({ 
      success: true, 
      message: 'Your password has been reset successfully. Please log in with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, error: 'An unexpected error occurred. Please try again.' });
  }
}

module.exports = {
  login,
  me,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
};

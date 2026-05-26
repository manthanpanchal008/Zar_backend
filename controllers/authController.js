const bcrypt = require('bcrypt');
const { findUserByEmail } = require('../models/userModel');
const { getSafeUserFromDbRow, signAdminToken } = require('../middleware/auth');

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

module.exports = {
  login,
  me,
  logout,
};

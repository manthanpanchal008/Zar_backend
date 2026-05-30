const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = require('../config/env');
const { getAdminMailTemplate } = require('../templates/buildConnectionAdminMail');
const { getUserMailTemplate } = require('../templates/buildConnectionUserMail');
const { getContactInquiryAdminMail } = require('../templates/contactInquiryAdminMail');
const { getContactInquiryUserMail } = require('../templates/contactInquiryUserMail');
const { getCareerApplicationAdminMail } = require('../templates/careerApplicationAdminMail');
const { getCareerApplicationUserMail } = require('../templates/careerApplicationUserMail');

// Create the transporter using SMTP environment configurations
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // Use SSL for port 465, otherwise use TLS (starttls)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * Generate a professional, modern HTML email template for password reset OTP.
 * @param {string} name - The user's name.
 * @param {string} otp - The 6-digit OTP code.
 * @param {number} expiryMinutes - The expiry time in minutes.
 * @returns {string} The full HTML content.
 */
function getOtpEmailTemplate(name, otp, expiryMinutes) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Zar Jewels</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #fdfcfa;
          color: #1c1917;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .card {
          background-color: #ffffff;
          border: 1px solid #eee7dd;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo-placeholder {
          font-size: 24px;
          font-weight: bold;
          color: #c4a46e;
          letter-spacing: 1px;
        }
        .title {
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: #1c1917;
          text-align: center;
        }
        .subtitle {
          font-size: 14px;
          color: #78716c;
          margin-top: 0;
          text-align: center;
        }
        .otp-container {
          background-color: #fdfcfa;
          border: 1px dashed #eee7dd;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 6px;
          color: #c4a46e;
          margin: 0;
        }
        .info-text {
          font-size: 15px;
          line-height: 1.6;
          color: #44403c;
          margin-bottom: 20px;
        }
        .warning-text {
          font-size: 13px;
          line-height: 1.5;
          color: #78716c;
          border-top: 1px solid #f5f5f4;
          padding-top: 20px;
          margin-top: 30px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #a8a29e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="logo-placeholder">Zar Jewels</div>
          </div>
          <h2 class="title">Reset Your Password</h2>
          <p class="subtitle">Secure One-Time Password (OTP) Request</p>
          
          <p class="info-text">Hello ${name},</p>
          <p class="info-text">We received a request to reset the password for your account. Use the verification code below to authorize this change:</p>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p class="info-text">This code will expire in <strong>${expiryMinutes} minutes</strong>. For security reasons, please do not share this OTP with anyone.</p>
          
          <div class="warning-text">
            <strong>Didn't make this request?</strong><br>
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </div>
        </div>
        <div class="footer">
          &copy; 2026 Zar Jewels. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send an OTP mail.
 * @param {string} email - Recipient email.
 * @param {string} name - Recipient name.
 * @param {string} otp - The 6-digit OTP code.
 * @param {number} expiryMinutes - The OTP expiry window.
 */
async function sendOtpEmail(email, name, otp, expiryMinutes = 15) {
  const mailOptions = {
    from: `"Zar Jewels Admin" <${SMTP_USER}>`,
    to: email,
    subject: `${otp} is your password reset code`,
    html: getOtpEmailTemplate(name, otp, expiryMinutes),
  };

  await transporter.sendMail(mailOptions);
}

async function sendConnectionAdminEmail(leadData) {
  const mailOptions = {
    from: `"Zar Jewels Admin" <${SMTP_USER}>`,
    to: SMTP_USER,
    subject: 'New Build A Connection Inquiry',
    html: getAdminMailTemplate(leadData),
  };
  await transporter.sendMail(mailOptions);
}

async function sendConnectionUserThankYouEmail(userEmail, userName) {
  const mailOptions = {
    from: `"Zar Jewels" <${SMTP_USER}>`,
    to: userEmail,
    subject: 'Thank you for showing interest | Zar Jewels',
    html: getUserMailTemplate(userName),
  };
  await transporter.sendMail(mailOptions);
}

async function sendContactInquiryAdminMail(data) {
  const mailOptions = {
    from: `"Zar Jewels Admin" <${SMTP_USER}>`,
    to: SMTP_USER,
    subject: 'New Contact Inquiry Submission',
    html: getContactInquiryAdminMail(data),
  };
  await transporter.sendMail(mailOptions);
}

async function sendContactInquiryUserThankYouMail(userEmail, userName) {
  const mailOptions = {
    from: `"Zar Jewels" <${SMTP_USER}>`,
    to: userEmail,
    subject: 'Thank you for contacting Zar Jewels',
    html: getContactInquiryUserMail(userName),
  };
  await transporter.sendMail(mailOptions);
}

async function sendCareerApplicationAdminMail(data, cvFullPath, cvFilename) {
  const mailOptions = {
    from: `"Zar Jewels Admin" <${SMTP_USER}>`,
    to: SMTP_USER,
    subject: `New Career Application for ${data.role}`,
    html: getCareerApplicationAdminMail(data),
    attachments: [
      {
        filename: cvFilename,
        path: cvFullPath,
      },
    ],
  };
  await transporter.sendMail(mailOptions);
}

async function sendCareerApplicationUserThankYouMail(userEmail, userName, role) {
  const mailOptions = {
    from: `"Zar Jewels" <${SMTP_USER}>`,
    to: userEmail,
    subject: `Application Received: ${role} | Zar Jewels`,
    html: getCareerApplicationUserMail(userName, role),
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendOtpEmail,
  sendConnectionAdminEmail,
  sendConnectionUserThankYouEmail,
  sendContactInquiryAdminMail,
  sendContactInquiryUserThankYouMail,
  sendCareerApplicationAdminMail,
  sendCareerApplicationUserThankYouMail,
};

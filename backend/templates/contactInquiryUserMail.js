/**
 * Premium User Thank You Email Template for Contact Inquiries
 * @param {string} name - Recipient full name
 * @returns {string} The formatted HTML content
 */
function getContactInquiryUserMail(name) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Thank You for Contacting Zar Jewels</title>
      <style type="text/css">
        body {
          margin: 0;
          padding: 0;
          min-width: 100%;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #fdfcfa;
          color: #1c1917;
        }
        .wrapper {
          width: 100%;
          background-color: #fdfcfa;
          padding: 40px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #eee7dd;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .hero {
          background-color: #1c1917;
          background-image: linear-gradient(rgba(28,25,23,0.9), rgba(28,25,23,0.95));
          padding: 50px 30px;
          text-align: center;
          border-bottom: 3px solid #c4a46e;
        }
        .logo {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 3px;
          color: #c4a46e;
          text-transform: uppercase;
        }
        .content {
          padding: 45px;
          text-align: center;
        }
        .greeting {
          font-size: 20px;
          font-weight: 600;
          color: #1c1917;
          margin-bottom: 20px;
        }
        .body-text {
          font-size: 15px;
          line-height: 1.7;
          color: #44403c;
          margin-bottom: 30px;
        }
        .cta-container {
          margin: 30px 0;
        }
        .cta-button {
          background-color: #c4a46e;
          color: #ffffff !important;
          padding: 14px 28px;
          font-weight: bold;
          text-decoration: none;
          font-size: 14px;
          border-radius: 6px;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-block;
        }
        .signature {
          border-top: 1px solid #f5f5f4;
          padding-top: 25px;
          margin-top: 35px;
          font-size: 14px;
          color: #78716c;
        }
        .footer {
          background-color: #faf8f5;
          padding: 25px;
          text-align: center;
          font-size: 11px;
          color: #a8a29e;
          border-top: 1px solid #eee7dd;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table class="container" width="600" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="hero">
                  <div class="logo">Zar Jewels</div>
                </td>
              </tr>
              <tr>
                <td class="content">
                  <div class="greeting">Thank You for Contacting Zar</div>
                  <div class="body-text">
                    Dear ${name},
                    <br/><br/>
                    We have successfully received your inquiry request. Our sales or customer relations team is currently reviewing your message. We aim to respond to all inquiries within 24 business hours.
                    <br/><br/>
                    We appreciate your interest in Zar Jewels and look forward to speaking with you shortly.
                  </div>
                  
                  <div class="cta-container">
                    <a href="https://zarjewels.com" target="_blank" class="cta-button">Visit Zar Jewels</a>
                  </div>

                  <div class="signature">
                    Warmest Regards,<br/>
                    <strong>The Zar Jewels Customer Care Team</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="footer">
                  &copy; ${currentYear} Zar Jewels. All rights reserved. <br/>
                  This is a post-submission confirmation email. Please do not reply directly.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = {
  getContactInquiryUserMail,
};

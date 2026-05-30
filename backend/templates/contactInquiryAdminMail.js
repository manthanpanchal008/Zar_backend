/**
 * Premium Admin Notification Email Template for Contact Inquiries
 * @param {Object} data - The inquiry form data
 * @returns {string} The formatted HTML content
 */
function getContactInquiryAdminMail(data) {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Contact Inquiry - Zar Jewels</title>
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
        .header {
          background-color: #1c1917;
          padding: 30px;
          text-align: center;
          border-bottom: 3px solid #c4a46e;
        }
        .logo {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #c4a46e;
          text-transform: uppercase;
        }
        .subtitle {
          color: #a8a29e;
          font-size: 13px;
          margin-top: 5px;
          letter-spacing: 1px;
        }
        .content {
          padding: 40px;
        }
        .title {
          font-size: 20px;
          font-weight: bold;
          color: #1c1917;
          margin-bottom: 20px;
          border-bottom: 1px solid #f5f5f4;
          padding-bottom: 10px;
        }
        .detail-row {
          padding: 12px 0;
          border-bottom: 1px solid #faf8f5;
        }
        .detail-label {
          font-size: 13px;
          color: #78716c;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .detail-value {
          font-size: 15px;
          color: #1c1917;
          font-weight: 500;
        }
        .message-card {
          margin-top: 25px;
          background-color: #faf8f5;
          border: 1px solid #eee7dd;
          border-radius: 8px;
          padding: 20px;
        }
        .message-title {
          font-size: 13px;
          color: #78716c;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .message-body {
          font-size: 14px;
          line-height: 1.6;
          color: #44403c;
          white-space: pre-line;
        }
        .footer {
          background-color: #faf8f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #a8a29e;
          border-top: 1px solid #eee7dd;
        }
      </style>
    </head>
    <body>
      <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <table class="container" width="600" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="header">
                  <div class="logo">Zar Jewels</div>
                  <div class="subtitle">New Customer Contact Inquiry</div>
                </td>
              </tr>
              <tr>
                <td class="content">
                  <div class="title">Inquiry Details</div>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td class="detail-row">
                        <div class="detail-label">Full Name</div>
                        <div class="detail-value">${data.fullName}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="detail-row">
                        <div class="detail-label">Company Name</div>
                        <div class="detail-value">${data.companyName || 'Not specified'}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="detail-row">
                        <div class="detail-label">Email Address</div>
                        <div class="detail-value">${data.email}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="detail-row">
                        <div class="detail-label">Contact Number</div>
                        <div class="detail-value" style="color: #c4a46e; font-weight: bold;">${data.contactNumber}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="detail-row" style="border-bottom: none;">
                        <div class="detail-label">Inquiry Type</div>
                        <div class="detail-value">${data.inquiryType}</div>
                      </td>
                    </tr>
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" border="0" class="message-card">
                    <tr>
                      <td>
                        <div class="message-title">Customer Message</div>
                        <div class="message-body">${data.message ? data.message.replace(/\n/g, '<br/>') : 'No message provided.'}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="footer">
                  This is an automated notification from the Zar Jewels portal.
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
  getContactInquiryAdminMail,
};

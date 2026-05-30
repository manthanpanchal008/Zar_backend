const pool = require('../config/db');

async function listInquiries() {
  const [rows] = await pool.execute(
    'SELECT id, fullName, companyName, email, contactNumber, inquiryType, message, created_at, updated_at FROM contact_inquiries ORDER BY id DESC'
  );
  return rows;
}

async function findInquiryById(id) {
  const [rows] = await pool.execute(
    'SELECT id, fullName, companyName, email, contactNumber, inquiryType, message, created_at, updated_at FROM contact_inquiries WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createInquiry({
  fullName,
  companyName,
  email,
  contactNumber,
  inquiryType,
  message,
}) {
  const [result] = await pool.execute(
    'INSERT INTO contact_inquiries (fullName, companyName, email, contactNumber, inquiryType, message) VALUES (?, ?, ?, ?, ?, ?)',
    [
      fullName,
      companyName,
      email,
      contactNumber,
      inquiryType,
      message,
    ]
  );
  return result.insertId;
}

async function deleteInquiryById(id) {
  await pool.execute('DELETE FROM contact_inquiries WHERE id = ?', [id]);
}

module.exports = {
  listInquiries,
  findInquiryById,
  createInquiry,
  deleteInquiryById,
};

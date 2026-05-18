const pool = require('../config/db');

async function createContact({ name, company, email, phone, subject, message }) {
  await pool.execute(
    'INSERT INTO contacts (name, company, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
    [name, company, email, phone, subject, message]
  );
}

async function listContacts() {
  const [rows] = await pool.execute(
    'SELECT id, name, company, email, phone, subject, message, created_at FROM contacts ORDER BY created_at DESC'
  );
  
  return rows;
}

module.exports = {
  createContact,
  listContacts,
};

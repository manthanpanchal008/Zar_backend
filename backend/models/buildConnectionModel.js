const pool = require('../config/db');

async function listConnections() {
  const [rows] = await pool.execute(
    'SELECT id, fullName, companyName, email, country, state, city, pincode, contact, category, referredBy, companyWebsite, message, created_at, updated_at FROM build_connections ORDER BY id DESC'
  );
  return rows;
}

async function findConnectionById(id) {
  const [rows] = await pool.execute(
    'SELECT id, fullName, companyName, email, country, state, city, pincode, contact, category, referredBy, companyWebsite, message, created_at, updated_at FROM build_connections WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createConnection({
  fullName,
  companyName,
  email,
  country,
  state,
  city,
  pincode,
  contact,
  category,
  referredBy,
  companyWebsite,
  message,
}) {
  const [result] = await pool.execute(
    'INSERT INTO build_connections (fullName, companyName, email, country, state, city, pincode, contact, category, referredBy, companyWebsite, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      fullName,
      companyName,
      email,
      country,
      state,
      city,
      pincode,
      contact,
      category,
      referredBy || null,
      companyWebsite || null,
      message || null,
    ]
  );
  return result.insertId;
}

async function deleteConnectionById(id) {
  await pool.execute('DELETE FROM build_connections WHERE id = ?', [id]);
}

module.exports = {
  listConnections,
  findConnectionById,
  createConnection,
  deleteConnectionById,
};

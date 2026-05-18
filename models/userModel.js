const pool = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, password, role FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function listUsers() {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id DESC'
  );
  return rows;
}

async function createUser({ name, email, password, role }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return result.insertId;
}

async function updateUserById(id, { name, email, role, password }) {
  if (password) {
    await pool.execute(
      'UPDATE users SET name = ?, email = ?, role = ?, password = ?, updated_at = NOW() WHERE id = ?',
      [name, email, role, password, id]
    );
  } else {
    await pool.execute(
      'UPDATE users SET name = ?, email = ?, role = ?, updated_at = NOW() WHERE id = ?',
      [name, email, role, id]
    );
  }
}

async function deleteUserById(id) {
  await pool.execute('DELETE FROM users WHERE id = ?', [id]);
}

async function emailExistsForOtherId(email, excludeId) {
  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE email = ? AND id != ?',
    [email, excludeId]
  );
  return rows.length > 0;
}

module.exports = {
  findUserByEmail,
  findUserById,
  listUsers,
  createUser,
  updateUserById,
  deleteUserById,
  emailExistsForOtherId,
};


const pool = require('../config/db');

async function listCareers() {
  const [rows] = await pool.execute(
    'SELECT id, position, experience, location, jobDescription, created_at, updated_at FROM careers ORDER BY id DESC'
  );
  return rows;
}

async function findCareerById(id) {
  const [rows] = await pool.execute(
    'SELECT id, position, experience, location, jobDescription, created_at, updated_at FROM careers WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createCareer({ position, experience, location, jobDescription }) {
  const [result] = await pool.execute(
    'INSERT INTO careers (position, experience, location, jobDescription) VALUES (?, ?, ?, ?)',
    [position, experience, location, jobDescription]
  );
  return result.insertId;
}

async function updateCareerById(id, { position, experience, location, jobDescription }) {
  await pool.execute(
    'UPDATE careers SET position = ?, experience = ?, location = ?, jobDescription = ?, updated_at = NOW() WHERE id = ?',
    [position, experience, location, jobDescription, id]
  );
}

async function deleteCareerById(id) {
  await pool.execute('DELETE FROM careers WHERE id = ?', [id]);
}

module.exports = {
  listCareers,
  findCareerById,
  createCareer,
  updateCareerById,
  deleteCareerById,
};

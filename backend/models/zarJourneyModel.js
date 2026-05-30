const pool = require('../config/db');

async function listJourneys() {
  const [rows] = await pool.execute(
    'SELECT id, year, description, image, created_at, updated_at FROM zar_journey ORDER BY year DESC'
  );
  return rows;
}

async function findJourneyById(id) {
  const [rows] = await pool.execute(
    'SELECT id, year, description, image, created_at, updated_at FROM zar_journey WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createJourney({ year, description, image }) {
  const [result] = await pool.execute(
    'INSERT INTO zar_journey (year, description, image) VALUES (?, ?, ?)',
    [year, description, image]
  );
  return result.insertId;
}

async function updateJourneyById(id, { year, description, image }) {
  await pool.execute(
    'UPDATE zar_journey SET year = ?, description = ?, image = ?, updated_at = NOW() WHERE id = ?',
    [year, description, image, id]
  );
}

async function deleteJourneyById(id) {
  await pool.execute('DELETE FROM zar_journey WHERE id = ?', [id]);
}

module.exports = {
  listJourneys,
  findJourneyById,
  createJourney,
  updateJourneyById,
  deleteJourneyById,
};

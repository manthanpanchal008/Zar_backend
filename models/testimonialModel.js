const pool = require('../config/db');

async function listTestimonials() {
  const [rows] = await pool.execute(
    'SELECT id, name, comment, position, companyName, created_at, updated_at FROM testimonials ORDER BY id DESC'
  );
  return rows;
}

async function findTestimonialById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, comment, position, companyName, created_at, updated_at FROM testimonials WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createTestimonial({ name, comment, position, companyName }) {
  const [result] = await pool.execute(
    'INSERT INTO testimonials (name, comment, position, companyName) VALUES (?, ?, ?, ?)',
    [name, comment, position || null, companyName || null]
  );
  return result.insertId;
}

async function updateTestimonialById(id, { name, comment, position, companyName }) {
  await pool.execute(
    'UPDATE testimonials SET name = ?, comment = ?, position = ?, companyName = ?, updated_at = NOW() WHERE id = ?',
    [name, comment, position || null, companyName || null, id]
  );
}

async function deleteTestimonialById(id) {
  await pool.execute('DELETE FROM testimonials WHERE id = ?', [id]);
}

module.exports = {
  listTestimonials,
  findTestimonialById,
  createTestimonial,
  updateTestimonialById,
  deleteTestimonialById,
};

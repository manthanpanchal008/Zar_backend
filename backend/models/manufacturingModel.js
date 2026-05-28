const pool = require('../config/db');

async function listManufacturing() {
  const [rows] = await pool.execute(
    'SELECT id, name, description, image, is_active, created_at, updated_at FROM manufacturing WHERE deleted_at IS NULL ORDER BY id DESC'
  );
  return rows;
}

async function findManufacturingById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, description, image, is_active, created_at, updated_at FROM manufacturing WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function createManufacturing({ name, description, image }) {
  const [result] = await pool.execute(
    'INSERT INTO manufacturing (name, description, image, is_active) VALUES (?, ?, ?, 1)',
    [name, description || null, image || null]
  );
  return result.insertId;
}

async function updateManufacturingById(id, { name, description, image, is_active }) {
  await pool.execute(
    'UPDATE manufacturing SET name = ?, description = ?, image = ?, is_active = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [name, description || null, image, is_active === undefined ? 1 : is_active, id]
  );
}

async function deleteManufacturingById(id) {
  await pool.execute(
    'UPDATE manufacturing SET deleted_at = NOW(), updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
}

module.exports = {
  listManufacturing,
  findManufacturingById,
  createManufacturing,
  updateManufacturingById,
  deleteManufacturingById,
};

const pool = require('../config/db');

async function listMakingTypes() {
  const [rows] = await pool.execute(
    'SELECT id, name, image, is_active, created_at, updated_at FROM making_types WHERE deleted_at IS NULL ORDER BY id DESC'
  );
  return rows;
}

async function listMakingTypesForSelection() {
  const [rows] = await pool.execute(
    'SELECT id, name FROM making_types WHERE deleted_at IS NULL AND is_active = 1 ORDER BY name ASC'
  );
  return rows;
}

async function createMakingType({ name, image }) {
  const [result] = await pool.execute(
    'INSERT INTO making_types (name, image, is_active) VALUES (?, ?, 1)',
    [name, image || null]
  );
  return result.insertId;
}

async function findMakingTypeById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, image, is_active, created_at, updated_at FROM making_types WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function updateMakingTypeById(id, { name, image, is_active }) {
  await pool.execute(
    'UPDATE making_types SET name = ?, image = ?, is_active = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [name, image, is_active === undefined ? 1 : is_active, id]
  );
}

async function deleteMakingTypeById(id) {
  await pool.execute(
    'UPDATE making_types SET deleted_at = NOW(), updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
}

module.exports = {
  listMakingTypes,
  listMakingTypesForSelection,
  createMakingType,
  findMakingTypeById,
  updateMakingTypeById,
  deleteMakingTypeById,
};

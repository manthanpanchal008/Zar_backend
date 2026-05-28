const pool = require('../config/db');

async function listCollectionTypes() {
  const [rows] = await pool.execute(
    'SELECT id, name, image, is_active, created_at, updated_at FROM collection_types WHERE deleted_at IS NULL ORDER BY id DESC'
  );
  return rows;
}

async function listCollectionTypesForSelection() {
  const [rows] = await pool.execute(
    'SELECT id, name FROM collection_types WHERE deleted_at IS NULL AND is_active = 1 ORDER BY name ASC'
  );
  return rows;
}

async function createCollectionType({ name, image }) {
  const [result] = await pool.execute(
    'INSERT INTO collection_types (name, image, is_active) VALUES (?, ?, 1)',
    [name, image || null]
  );
  return result.insertId;
}

async function findCollectionTypeById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, image, is_active, created_at, updated_at FROM collection_types WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function updateCollectionTypeById(id, { name, image, is_active }) {
  await pool.execute(
    'UPDATE collection_types SET name = ?, image = ?, is_active = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [name, image, is_active === undefined ? 1 : is_active, id]
  );
}

async function deleteCollectionTypeById(id) {
  await pool.execute(
    'UPDATE collection_types SET deleted_at = NOW(), updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
}

module.exports = {
  listCollectionTypes,
  listCollectionTypesForSelection,
  createCollectionType,
  findCollectionTypeById,
  updateCollectionTypeById,
  deleteCollectionTypeById,
};

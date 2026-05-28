const pool = require('../config/db');

async function listGoldTypes() {
  const [rows] = await pool.execute(
    'SELECT id, name, purity, image, is_active, created_at, updated_at FROM gold_types WHERE deleted_at IS NULL ORDER BY id DESC'
  );
  return rows;
}

async function listGoldTypesForSelection() {
  const [rows] = await pool.execute(
    'SELECT id, name, purity FROM gold_types WHERE deleted_at IS NULL AND is_active = 1 ORDER BY name ASC'
  );
  return rows;
}

async function createGoldType({ name, purity, image }) {
  const [result] = await pool.execute(
    'INSERT INTO gold_types (name, purity, image, is_active) VALUES (?, ?, ?, 1)',
    [name, purity, image || null]
  );
  return result.insertId;
}

async function findGoldTypeById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, purity, image, is_active, created_at, updated_at FROM gold_types WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function updateGoldTypeById(id, { name, purity, image, is_active }) {
  await pool.execute(
    'UPDATE gold_types SET name = ?, purity = ?, image = ?, is_active = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [name, purity, image, is_active === undefined ? 1 : is_active, id]
  );
}

async function deleteGoldTypeById(id) {
  await pool.execute(
    'UPDATE gold_types SET deleted_at = NOW(), updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
}

module.exports = {
  listGoldTypes,
  listGoldTypesForSelection,
  createGoldType,
  findGoldTypeById,
  updateGoldTypeById,
  deleteGoldTypeById,
};

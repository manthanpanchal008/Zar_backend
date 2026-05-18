const pool = require('../config/db');

async function listJewels() {
  const [rows] = await pool.execute(
    'SELECT id, collection_type, category, collection_url, image, created_at, updated_at FROM jewels WHERE deleted_at IS NULL ORDER BY id DESC'
  );
  return rows;
}

async function listJewelsByCollectionType(collectionType) {
  const [rows] = await pool.execute(
    'SELECT id, collection_type, category, collection_url, image, created_at, updated_at FROM jewels WHERE collection_type = ? AND deleted_at IS NULL ORDER BY id DESC',
    [collectionType]
  );
  return rows;
}

async function listDistinctJewelCategories() {
  const [rows] = await pool.execute(
    'SELECT DISTINCT category FROM jewels WHERE deleted_at IS NULL AND category IS NOT NULL AND category <> "" ORDER BY category ASC'
  );
  return rows.map((row) => row.category);
}

async function listJewelsForCategorySelection() {
  const [rows] = await pool.execute(
    `SELECT
      id,
      TRIM(category) AS category,
      collection_url,
      collection_type
    FROM jewels
    WHERE deleted_at IS NULL
      AND category IS NOT NULL
      AND TRIM(category) <> ''
    ORDER BY category ASC, id DESC`
  );
  return rows;
}

async function createJewel({ collection_type, category, collection_url, image }) {
  await pool.execute(
    'INSERT INTO jewels (collection_type, category, collection_url, image) VALUES (?, ?, ?, ?)',
    [collection_type, category, collection_url || null, image || null]
  );
}

async function findJewelById(id) {
  const [rows] = await pool.execute(
    'SELECT id, collection_type, category, collection_url, image, created_at, updated_at FROM jewels WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function updateJewelById(id, { collection_type, category, collection_url, image }) {
  await pool.execute(
    'UPDATE jewels SET collection_type = ?, category = ?, collection_url = ?, image = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [collection_type, category, collection_url || null, image, id]
  );
}

async function deleteJewelById(id) {
  await pool.execute('UPDATE jewels SET deleted_at = NOW(), updated_at = NOW() WHERE id = ? AND deleted_at IS NULL', [id]);
}

module.exports = {
  listJewels,
  listJewelsByCollectionType,
  listDistinctJewelCategories,
  listJewelsForCategorySelection,
  createJewel,
  findJewelById,
  updateJewelById,
  deleteJewelById,
};

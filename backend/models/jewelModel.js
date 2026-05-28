const pool = require('../config/db');

async function listJewelsByCollectionType(collectionType) {
  const searchPattern = `%${String(collectionType || '').toUpperCase()}%`;
  const [rows] = await pool.execute(
    'SELECT id, name AS category, image, is_active FROM gold_types WHERE name LIKE ? AND deleted_at IS NULL',
    [searchPattern]
  );
  return rows.map(r => ({
    id: r.id,
    collection_type: collectionType,
    category: r.category,
    collection_url: '',
    image: r.image
  }));
}

async function listDistinctJewelCategories() {
  const [rows] = await pool.execute(
    'SELECT DISTINCT name FROM categories WHERE deleted_at IS NULL AND is_active = 1'
  );
  return rows.map(r => r.name);
}

async function listJewelsForCategorySelection() {
  const [rows] = await pool.execute(
    'SELECT id, name AS category, "22k" AS collection_type FROM gold_types WHERE deleted_at IS NULL AND is_active = 1'
  );
  return rows;
}

module.exports = {
  listJewelsByCollectionType,
  listDistinctJewelCategories,
  listJewelsForCategorySelection
};

const pool = require('../config/db');

async function listSubcategories() {
  const [rows] = await pool.execute(
    `SELECT
      s.id,
      s.category_id,
      j.category AS category_name,
      s.collection_type,
      s.category,
      s.subcategory_url,
      s.image,
      s.created_at,
      s.updated_at
    FROM jewel_subcategories s
    LEFT JOIN jewels j ON j.id = s.category_id
    WHERE s.deleted_at IS NULL
    ORDER BY s.id DESC`
  );
  return rows;
}

async function listSubcategoriesByCategoryId(categoryId) {
  const [rows] = await pool.execute(
    `SELECT
      s.id,
      s.category_id,
      j.category AS category_name,
      s.collection_type,
      s.category,
      s.subcategory_url,
      s.image,
      s.created_at,
      s.updated_at
    FROM jewel_subcategories s
    LEFT JOIN jewels j ON j.id = s.category_id
    WHERE s.category_id = ? AND s.deleted_at IS NULL
    ORDER BY s.id DESC`,
    [categoryId]
  );
  return rows;
}

async function listSubcategoriesByCollectionAndCategory({ collectionType, categoryId }) {
  const [rows] = await pool.execute(
    `SELECT
      s.id,
      s.category_id,
      j.category AS category_name,
      s.collection_type,
      s.category,
      s.subcategory_url,
      s.image,
      s.created_at,
      s.updated_at
    FROM jewel_subcategories s
    LEFT JOIN jewels j ON j.id = s.category_id
    WHERE s.collection_type = ?
      AND s.category_id = ?
      AND s.deleted_at IS NULL
    ORDER BY s.id DESC`,
    [collectionType, categoryId]
  );
  return rows;
}

async function listSubcategoriesForSelectionByCategoryId(categoryId) {
  const [rows] = await pool.execute(
    `SELECT
      id,
      category_id,
      TRIM(category) AS category,
      subcategory_url,
      collection_type
    FROM jewel_subcategories
    WHERE category_id = ?
      AND deleted_at IS NULL
      AND category IS NOT NULL
      AND TRIM(category) <> ''
    ORDER BY category ASC, id DESC`,
    [categoryId]
  );
  return rows;
}

async function listSubcategoriesForSelection() {
  const [rows] = await pool.execute(
    `SELECT
      id,
      category_id,
      TRIM(category) AS category,
      subcategory_url,
      collection_type
    FROM jewel_subcategories
    WHERE deleted_at IS NULL
      AND category IS NOT NULL
      AND TRIM(category) <> ''
    ORDER BY category ASC, id DESC`
  );
  return rows;
}

async function createSubcategory({ category_id, collection_type, category, subcategory_url, image }) {
  await pool.execute(
    'INSERT INTO jewel_subcategories (category_id, collection_type, category, subcategory_url, image) VALUES (?, ?, ?, ?, ?)',
    [category_id, collection_type, category, subcategory_url || null, image || null]
  );
}

async function findSubcategoryById(id) {
  const [rows] = await pool.execute(
    `SELECT
      s.id,
      s.category_id,
      j.category AS category_name,
      s.collection_type,
      s.category,
      s.subcategory_url,
      s.image,
      s.created_at,
      s.updated_at
    FROM jewel_subcategories s
    LEFT JOIN jewels j ON j.id = s.category_id
    WHERE s.id = ? AND s.deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}

async function updateSubcategoryById(id, { category_id, collection_type, category, subcategory_url, image }) {
  await pool.execute(
    `UPDATE jewel_subcategories
    SET category_id = ?, collection_type = ?, category = ?, subcategory_url = ?, image = ?, updated_at = NOW()
    WHERE id = ? AND deleted_at IS NULL`,
    [category_id, collection_type, category, subcategory_url || null, image, id]
  );
}

async function deleteSubcategoryById(id) {
  await pool.execute(
    'UPDATE jewel_subcategories SET deleted_at = NOW(), updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
}

module.exports = {
  listSubcategories,
  listSubcategoriesByCategoryId,
  listSubcategoriesByCollectionAndCategory,
  listSubcategoriesForSelectionByCategoryId,
  listSubcategoriesForSelection,
  createSubcategory,
  findSubcategoryById,
  updateSubcategoryById,
  deleteSubcategoryById,
};

const pool = require('../config/db');

async function listSubcategoriesByCollectionAndCategory({ collectionType, categoryId }) {
  const [rows] = await pool.execute(
    'SELECT id, name AS category, slug AS subcategory_url, image FROM categories WHERE deleted_at IS NULL AND is_active = 1'
  );
  return rows.map(r => ({
    id: r.id,
    category_id: categoryId,
    category_name: '',
    collection_type: collectionType,
    category: r.category,
    subcategory_url: r.subcategory_url,
    image: r.image
  }));
}

async function listSubcategoriesForSelectionByCategoryId(categoryId) {
  const [rows] = await pool.execute(
    'SELECT id, name AS category FROM categories WHERE deleted_at IS NULL AND is_active = 1'
  );
  return rows;
}

module.exports = {
  listSubcategoriesByCollectionAndCategory,
  listSubcategoriesForSelectionByCategoryId
};

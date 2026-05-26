const pool = require('../config/db');

async function listCategories() {
  const [rows] = await pool.execute(
    'SELECT id, name, slug, image, is_active, created_at, updated_at FROM categories WHERE deleted_at IS NULL ORDER BY id DESC'
  );
  return rows;
}

async function listCategoriesForSelection() {
  const [rows] = await pool.execute(
    'SELECT id, name, slug FROM categories WHERE deleted_at IS NULL AND is_active = 1 ORDER BY name ASC'
  );
  return rows;
}

async function createCategory({ name, slug, image }) {
  const [result] = await pool.execute(
    'INSERT INTO categories (name, slug, image, is_active) VALUES (?, ?, ?, 1)',
    [name, slug, image || null]
  );
  return result.insertId;
}

async function findCategoryById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, slug, image, is_active, created_at, updated_at FROM categories WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}

async function findCategoryBySlug(slug) {
  const [rows] = await pool.execute(
    'SELECT id, name, slug, image, is_active, created_at, updated_at FROM categories WHERE slug = ? AND deleted_at IS NULL',
    [slug]
  );
  return rows[0] || null;
}

async function updateCategoryById(id, { name, slug, image, is_active }) {
  await pool.execute(
    'UPDATE categories SET name = ?, slug = ?, image = ?, is_active = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [name, slug, image, is_active === undefined ? 1 : is_active, id]
  );
}

async function deleteCategoryById(id) {
  await pool.execute(
    'UPDATE categories SET deleted_at = NOW(), updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
}

module.exports = {
  listCategories,
  listCategoriesForSelection,
  createCategory,
  findCategoryById,
  findCategoryBySlug,
  updateCategoryById,
  deleteCategoryById,
};

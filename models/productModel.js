const path = require('path');
const pool = require('../config/db');

function normalizeImageName(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;

  // Accept legacy full paths/URLs but store only the file name.
  const withoutQuery = raw.split('?')[0].split('#')[0];
  const base = path.posix.basename(withoutQuery.replace(/\\/g, '/'));
  return base || null;
}

function normalizeImageNames(values) {
  return (Array.isArray(values) ? values : [])
    .map((item) => normalizeImageName(item))
    .filter(Boolean);
}

function parseImageArray(rawValue) {
  if (!rawValue) return [];

  if (Array.isArray(rawValue)) {
    return normalizeImageNames(rawValue);
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return normalizeImageNames(parsed);
    }
  } catch (_error) {
    // Keep backward compatibility for legacy single-value rows.
  }

  return normalizeImageNames([rawValue]);
}

function parseRowArray(rawValue) {
  if (!rawValue) return [];

  if (Array.isArray(rawValue)) {
    return rawValue.filter((row) => row && typeof row === 'object');
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return parsed.filter((row) => row && typeof row === 'object');
    }
  } catch (_error) {
    // Ignore malformed JSON and return empty list.
  }

  return [];
}

function withParsedImages(row) {
  return {
    ...row,
    product_images: parseImageArray(row.product_images),
    weight_specifications: parseRowArray(row.weight_specifications),
    technical_specifications: parseRowArray(row.technical_specifications),
  };
}

async function listProducts() {
  const [rows] = await pool.execute(
    `SELECT
      p.id,
      p.category_id,
      p.subcategory_id,
      j.category AS category_name,
      s.category AS subcategory_name,
      p.title,
      p.collection_name,
      p.short_description,
      p.number_of_pcs,
      p.display_finish,
      p.weight_specifications,
      p.technical_specifications,
      p.manufacturing_support,
      p.product_url,
      p.product_images,
      p.created_at,
      p.updated_at
    FROM products p
    LEFT JOIN jewels j ON j.id = p.category_id
    LEFT JOIN jewel_subcategories s ON s.id = p.subcategory_id
    WHERE p.deleted_at IS NULL
    ORDER BY p.id DESC`
  );

  return rows.map(withParsedImages);
}

async function listProductsByCategory(categoryName) {
  const [rows] = await pool.execute(
    `SELECT
      p.id,
      p.category_id,
      p.subcategory_id,
      j.category AS category_name,
      s.category AS subcategory_name,
      p.title,
      p.collection_name,
      p.short_description,
      p.number_of_pcs,
      p.display_finish,
      p.weight_specifications,
      p.technical_specifications,
      p.manufacturing_support,
      p.product_url,
      p.product_images,
      p.created_at,
      p.updated_at
    FROM products p
    LEFT JOIN jewels j ON j.id = p.category_id
    LEFT JOIN jewel_subcategories s ON s.id = p.subcategory_id
    WHERE j.category = ? AND p.deleted_at IS NULL
    ORDER BY p.id DESC`,
    [categoryName]
  );

  return rows.map(withParsedImages);
}

async function listProductsByCategoryAndSubcategory({ categoryId, subcategoryId }) {
  const [rows] = await pool.execute(
    `SELECT
      p.id,
      p.category_id,
      p.subcategory_id,
      j.category AS category_name,
      s.category AS subcategory_name,
      p.title,
      p.collection_name,
      p.short_description,
      p.number_of_pcs,
      p.display_finish,
      p.weight_specifications,
      p.technical_specifications,
      p.manufacturing_support,
      p.product_url,
      p.product_images,
      p.created_at,
      p.updated_at
    FROM products p
    LEFT JOIN jewels j ON j.id = p.category_id
    LEFT JOIN jewel_subcategories s ON s.id = p.subcategory_id
    WHERE p.category_id = ?
      AND p.subcategory_id = ?
      AND p.deleted_at IS NULL
    ORDER BY p.id DESC`,
    [categoryId, subcategoryId]
  );

  return rows.map(withParsedImages);
}

async function createProduct(product) {
  const [result] = await pool.execute(
    `INSERT INTO products (
      category_id,
      subcategory_id,
      title,
      collection_name,
      short_description,
      number_of_pcs,
      display_finish,
      weight_specifications,
      technical_specifications,
      manufacturing_support,
      product_url,
      product_images
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.category_id,
      product.subcategory_id,
      product.title,
      product.collection_name,
      product.short_description,
      product.number_of_pcs,
      product.display_finish,
      JSON.stringify(product.weight_specifications || []),
      JSON.stringify(product.technical_specifications || []),
      product.manufacturing_support,
      product.product_url,
      JSON.stringify(normalizeImageNames(product.product_images || [])),
    ]
  );

  return result.insertId;
}

async function findProductById(id) {
  const [rows] = await pool.execute(
    `SELECT
      p.id,
      p.category_id,
      p.subcategory_id,
      j.category AS category_name,
      s.category AS subcategory_name,
      p.title,
      p.collection_name,
      p.short_description,
      p.number_of_pcs,
      p.display_finish,
      p.weight_specifications,
      p.technical_specifications,
      p.manufacturing_support,
      p.product_url,
      p.product_images,
      p.created_at,
      p.updated_at
    FROM products p
    LEFT JOIN jewels j ON j.id = p.category_id
    LEFT JOIN jewel_subcategories s ON s.id = p.subcategory_id
    WHERE p.id = ? AND p.deleted_at IS NULL`,
    [id]
  );

  if (!rows[0]) return null;
  return withParsedImages(rows[0]);
}

async function updateProductById(id, product) {
  await pool.execute(
    `UPDATE products SET
      category_id = ?,
      subcategory_id = ?,
      title = ?,
      collection_name = ?,
      short_description = ?,
      number_of_pcs = ?,
      display_finish = ?,
      weight_specifications = ?,
      technical_specifications = ?,
      manufacturing_support = ?,
      product_url = ?,
      product_images = ?,
      updated_at = NOW()
    WHERE id = ? AND deleted_at IS NULL`,
    [
      product.category_id,
      product.subcategory_id,
      product.title,
      product.collection_name,
      product.short_description,
      product.number_of_pcs,
      product.display_finish,
      JSON.stringify(product.weight_specifications || []),
      JSON.stringify(product.technical_specifications || []),
      product.manufacturing_support,
      product.product_url,
      JSON.stringify(normalizeImageNames(product.product_images || [])),
      id,
    ]
  );
}

async function deleteProductById(id) {
  await pool.execute(
    'UPDATE products SET deleted_at = NOW(), updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
}

module.exports = {
  listProducts,
  listProductsByCategory,
  listProductsByCategoryAndSubcategory,
  createProduct,
  findProductById,
  updateProductById,
  deleteProductById,
};

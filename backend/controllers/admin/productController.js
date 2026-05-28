const fs = require('fs');
const path = require('path');
const {
  listProducts,
  createProduct,
  findProductById,
  updateProductById,
  deleteProductById,
  findProductBySku,
} = require('../../models/productModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'products');
const MAX_PRODUCT_IMAGES = 10;

function parseIntOrNull(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function normalizeToArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function parseRows(firstColumnValues, secondColumnValues, firstKey, secondKey) {
  const col1 = normalizeToArray(firstColumnValues);
  const col2 = normalizeToArray(secondColumnValues);
  const maxLen = Math.max(col1.length, col2.length);
  const rows = [];

  for (let i = 0; i < maxLen; i += 1) {
    const left = String(col1[i] || '').trim();
    const right = String(col2[i] || '').trim();
    if (!left && !right) continue;
    rows.push({ [firstKey]: left, [secondKey]: right });
  }

  return rows;
}

function normalizeImageName(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  return path.posix.basename(raw.split('?')[0].split('#')[0].replace(/\\/g, '/')) || null;
}

function normalizeImageNames(values) {
  return normalizeToArray(values).map(normalizeImageName).filter(Boolean);
}

function serializeProduct(item) {
  return {
    ...item,
    product_images: (item.product_images || []).map((name) => `/uploads/products/${name}`),
  };
}

function getCategoryShortCode(name) {
  const norm = String(name || '').trim().toUpperCase();
  if (norm.startsWith('BANGLE')) return 'BNG';
  if (norm.startsWith('RING')) return 'RNG';
  if (norm.startsWith('MANGALSUTRA')) return 'MGL';
  if (norm.startsWith('KADA')) return 'KDA';
  if (norm.startsWith('CHAIN')) return 'CHN';

  // Consonant fallback
  const withoutVowels = norm.replace(/[AEIOU]/g, '');
  if (withoutVowels.length >= 3) {
    return withoutVowels.substring(0, 3);
  }
  const cleaned = norm.replace(/[^A-Z]/g, '');
  return (cleaned + 'XXX').substring(0, 3);
}

function getGoldTypeShortCode(name) {
  return String(name || '').trim().toUpperCase().replace(/\s+/g, '');
}

function getCollectionTypeShortCode(name) {
  const norm = String(name || '').trim().toUpperCase();
  if (norm === 'HANDMADE') return 'HM';
  if (norm === 'PLAIN') return 'PL';
  if (norm === 'FANCY') return 'FN';
  if (norm === 'MACHINE MADE' || norm === 'MACHINEMADE') return 'MM';

  // Split-word initials or consonant fallback for others
  const words = norm.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).substring(0, 2);
  }
  const withoutVowels = norm.replace(/[AEIOU]/g, '');
  if (withoutVowels.length >= 2) {
    return withoutVowels.substring(0, 2);
  }
  const cleaned = norm.replace(/[^A-Z]/g, '');
  return (cleaned + 'XX').substring(0, 2);
}

async function getNextProductSequence() {
  const pool = require('../../config/db');
  const [rows] = await pool.execute('SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM products');
  return rows[0].next_id;
}

function buildPayload(body, imageNames) {
  return {
    category_id: parseIntOrNull(body.category_id),
    gold_type_id: parseIntOrNull(body.gold_type_id),
    collection_type_id: parseIntOrNull(body.collection_type_id),
    sku: String(body.sku || '').trim() || null,
    title: String(body.title || '').trim() || null,
    short_description: String(body.short_description || '').trim() || null,
    number_of_pcs: parseIntOrNull(body.number_of_pcs),
    display_finish: String(body.display_finish || '').trim() || null,
    weight_specifications: parseRows(body.weight_label, body.weight_value, 'label', 'value'),
    technical_specifications: parseRows(body.technical_feature, body.technical_detail, 'feature', 'details'),
    manufacturing_support: String(body.manufacturing_support || '').trim() || null,
    product_url: String(body.product_url || '').trim() || null,
    product_images: imageNames,
  };
}

async function validatePayload(payload, productId = null) {
  if (!payload.category_id) return 'Please select a Category.';
  if (!payload.gold_type_id) return 'Please select a Gold Type.';
  if (!payload.collection_type_id) return 'Please select a Collection Type.';
  if (!payload.title) return 'Product title is required.';
  if (!payload.number_of_pcs) return 'Number of Pcs is required.';
  if (!payload.product_images.length) return 'At least one product image is required.';
  if (payload.product_images.length > MAX_PRODUCT_IMAGES) return `You may upload at most ${MAX_PRODUCT_IMAGES} product images.`;

  const { findCategoryById } = require('../../models/categoryModel');
  const { findGoldTypeById } = require('../../models/goldTypeModel');
  const { findCollectionTypeById } = require('../../models/collectionTypeModel');

  const [category, goldType, collectionType] = await Promise.all([
    findCategoryById(payload.category_id),
    findGoldTypeById(payload.gold_type_id),
    findCollectionTypeById(payload.collection_type_id),
  ]);

  if (!category) return 'Selected Category is not available.';
  if (!goldType) return 'Selected Gold Type is not available.';
  if (!collectionType) return 'Selected Collection Type is not available.';

  // Securely generate/verify SKU on backend
  let seq = productId;
  if (!seq) {
    seq = await getNextProductSequence();
  }

  const catCode = getCategoryShortCode(category.name);
  const goldCode = getGoldTypeShortCode(goldType.name);
  const makeCode = getCollectionTypeShortCode(collectionType.name);
  const seqStr = String(seq).padStart(3, '0');
  const computedSku = `${catCode}-${goldCode}-${makeCode}-${seqStr}`;

  payload.sku = computedSku;

  const existingSku = await findProductBySku(computedSku);
  if (existingSku && Number(existingSku.id) !== Number(productId)) {
    return `Generated SKU "${computedSku}" is already in use by another product.`;
  }

  return null;
}

function removeUploadedFiles(files) {
  for (const filename of normalizeImageNames(files)) {
    fs.unlink(path.join(uploadDir, filename), () => {});
  }
}

async function index(_req, res) {
  try {
    const items = await listProducts();
    return res.json({ success: true, items: items.map(serializeProduct) });
  } catch (error) {
    console.error('Failed to list admin products:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch products.' });
  }
}

async function show(req, res) {
  try {
    const product = await findProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    return res.json({ success: true, product: serializeProduct(product) });
  } catch (error) {
    console.error('Failed to fetch admin product:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch product.' });
  }
}

async function store(req, res) {
  const uploadedImages = normalizeImageNames((req.files || []).map((file) => file.filename));
  const payload = buildPayload(req.body, uploadedImages);
  const validationError = await validatePayload(payload);

  if (validationError) {
    removeUploadedFiles(uploadedImages);
    return res.status(400).json({ success: false, error: validationError });
  }

  try {
    const id = await createProduct(payload);
    const product = await findProductById(id);
    return res.status(201).json({ success: true, message: 'Product added successfully.', product: serializeProduct(product) });
  } catch (error) {
    removeUploadedFiles(uploadedImages);
    console.error('Failed to create admin product:', error);
    return res.status(500).json({ success: false, error: 'Failed to add product.' });
  }
}

async function update(req, res) {
  const existing = await findProductById(req.params.id);
  if (!existing) {
    removeUploadedFiles((req.files || []).map((file) => file.filename));
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  const keptImages = normalizeImageNames(parseJsonArray(req.body.existing_images));
  const uploadedImages = normalizeImageNames((req.files || []).map((file) => file.filename));
  const finalImages = [...keptImages, ...uploadedImages];
  const payload = buildPayload(req.body, finalImages);
  const validationError = await validatePayload(payload, req.params.id);

  if (validationError) {
    removeUploadedFiles(uploadedImages);
    return res.status(400).json({ success: false, error: validationError });
  }

  try {
    await updateProductById(req.params.id, payload);
    const removedImages = normalizeImageNames(existing.product_images).filter((image) => !keptImages.includes(image));
    removeUploadedFiles(removedImages);
    const product = await findProductById(req.params.id);
    return res.json({ success: true, message: 'Product updated successfully.', product: serializeProduct(product) });
  } catch (error) {
    removeUploadedFiles(uploadedImages);
    console.error('Failed to update admin product:', error);
    return res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findProductById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Product not found.' });

    await deleteProductById(req.params.id);
    removeUploadedFiles(existing.product_images);
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete admin product:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete product.' });
  }
}

async function generateSku(req, res) {
  const categoryId = parseIntOrNull(req.query.category_id);
  const goldTypeId = parseIntOrNull(req.query.gold_type_id);
  const collectionTypeId = parseIntOrNull(req.query.collection_type_id || req.query.making_type_id);
  const productId = req.query.product_id ? parseIntOrNull(req.query.product_id) : null;

  if (!categoryId || !goldTypeId || !collectionTypeId) {
    return res.status(400).json({ success: false, error: 'Category, Gold Type, and Collection Type are required.' });
  }

  try {
    const { findCategoryById } = require('../../models/categoryModel');
    const { findGoldTypeById } = require('../../models/goldTypeModel');
    const { findCollectionTypeById } = require('../../models/collectionTypeModel');

    const [category, goldType, collectionType] = await Promise.all([
      findCategoryById(categoryId),
      findGoldTypeById(goldTypeId),
      findCollectionTypeById(collectionTypeId),
    ]);

    if (!category) return res.status(400).json({ success: false, error: 'Category not found.' });
    if (!goldType) return res.status(400).json({ success: false, error: 'Gold Type not found.' });
    if (!collectionType) return res.status(400).json({ success: false, error: 'Collection Type not found.' });

    let seq = productId;
    if (!seq) {
      seq = await getNextProductSequence();
    }

    const catCode = getCategoryShortCode(category.name);
    const goldCode = getGoldTypeShortCode(goldType.name);
    const makeCode = getCollectionTypeShortCode(collectionType.name);
    const seqStr = String(seq).padStart(3, '0');

    const sku = `${catCode}-${goldCode}-${makeCode}-${seqStr}`;
    return res.json({ success: true, sku });
  } catch (error) {
    console.error('Failed to generate SKU:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate SKU.' });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  generateSku,
};

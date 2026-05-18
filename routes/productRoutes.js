const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {
  listProducts,
  createProduct,
  findProductById,
  updateProductById,
  deleteProductById,
} = require('../models/productModel');
const { listJewelsForCategorySelection } = require('../models/jewelModel');
const { listSubcategoriesForSelection, listSubcategoriesForSelectionByCategoryId } = require('../models/subcategoryModel');
const { requireLogin, requireWebRole } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
fs.mkdirSync(uploadDir, { recursive: true });

function createTargetFilename(originalName) {
  const rawName = String(originalName || '').replace(/\\/g, '/');
  const baseName = path.basename(rawName) || 'product-image';
  const ext = path.extname(baseName).toLowerCase();
  const rawBase = path.basename(baseName, ext) || 'product-image';
  const safeBase = rawBase
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'product-image';

  return `${safeBase}${ext}`;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, createTargetFilename(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new Error('Only image files are allowed.'));
  },
});

const MAX_PRODUCT_IMAGES = 10;

function setFlash(req, type, message) {
  req.session.flash = { type, message };
}

function parseDecimalOrNull(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

function parseIntOrNull(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function parseIdOrNull(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function normalizeToArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function parseRowList(firstColumnValues, secondColumnValues, firstKey, secondKey) {
  const col1 = normalizeToArray(firstColumnValues);
  const col2 = normalizeToArray(secondColumnValues);
  const maxLen = Math.max(col1.length, col2.length);
  const rows = [];

  for (let i = 0; i < maxLen; i += 1) {
    const left = String(col1[i] || '').trim();
    const right = String(col2[i] || '').trim();

    if (!left && !right) continue;

    rows.push({
      [firstKey]: left,
      [secondKey]: right,
    });
  }

  return rows;
}

function parseExistingRows(rawValue) {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) {
      return parsed.filter((row) => row && typeof row === 'object');
    }
  } catch (_error) {
    // Ignore malformed JSON.
  }

  return [];
}

function getFallbackWeightRows(form) {
  const rows = [];

  if (String(form.gross_weight_grams || '').trim()) {
    rows.push({ label: 'Gross Weight', value: `${String(form.gross_weight_grams).trim()} grams` });
  }
  if (String(form.net_gold_weight_grams || '').trim()) {
    rows.push({ label: 'Net Gold Weight', value: `${String(form.net_gold_weight_grams).trim()} grams` });
  }

  const stoneGrams = String(form.stone_weight_grams || '').trim();
  const stoneCarats = String(form.stone_weight_carats || '').trim();
  if (stoneGrams || stoneCarats) {
    const suffix = stoneCarats ? ` (${stoneCarats} Carats)` : '';
    rows.push({ label: 'Stone Weight', value: `${stoneGrams || '-'} grams${suffix}` });
  }

  return rows;
}

function getFallbackTechnicalRows(form) {
  const rows = [];

  if (String(form.metal_purity || '').trim()) {
    rows.push({ feature: 'Metal Purity', details: String(form.metal_purity).trim() });
  }
  if (String(form.technical_finish || '').trim()) {
    rows.push({ feature: 'Finish', details: String(form.technical_finish).trim() });
  }
  if (String(form.stone_composition || '').trim()) {
    rows.push({ feature: 'Stone Composition', details: String(form.stone_composition).trim() });
  }
  if (String(form.construction || '').trim()) {
    rows.push({ feature: 'Construction', details: String(form.construction).trim() });
  }

  return rows;
}

function enrichForForm(product) {
  const weightRows = Array.isArray(product.weight_specifications) ? product.weight_specifications : [];
  const technicalRows = Array.isArray(product.technical_specifications) ? product.technical_specifications : [];

  return {
    ...product,
    weight_specifications: weightRows.length > 0 ? weightRows : getFallbackWeightRows(product),
    technical_specifications: technicalRows.length > 0 ? technicalRows : getFallbackTechnicalRows(product),
  };
}

function parseExistingImages(raw) {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return normalizeImageNames(raw);
  }

  const text = String(raw).trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return normalizeImageNames(parsed);
    }
  } catch (_error) {
    // Ignore malformed JSON and fallback to raw value.
  }

  return normalizeImageNames([text]);
}

function normalizeImageName(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const withoutQuery = raw.split('?')[0].split('#')[0];
  const base = path.posix.basename(withoutQuery.replace(/\\/g, '/'));
  return base || null;
}

function normalizeImageNames(values) {
  return (Array.isArray(values) ? values : [])
    .map((item) => normalizeImageName(item))
    .filter(Boolean);
}

function buildProductPayload(form, imagePaths) {
  const weightSpecifications = parseRowList(form.weight_label, form.weight_value, 'label', 'value');
  const technicalSpecifications = parseRowList(form.technical_feature, form.technical_detail, 'feature', 'details');
  const title = (form.title || '').trim();

  return {
    category_id: parseIdOrNull(form.category_id),
    subcategory_id: parseIdOrNull(form.subcategory_id),
    title: title || null,
    collection_name: (form.collection_name || '').trim() || null,
    short_description: (form.short_description || '').trim() || null,
    number_of_pcs: parseIntOrNull(form.number_of_pcs),
    display_finish: (form.display_finish || '').trim() || null,
    weight_specifications: weightSpecifications,
    technical_specifications: technicalSpecifications,
    manufacturing_support: (form.manufacturing_support || '').trim() || null,
    product_url: (form.product_url || '').trim() || null,
    product_images: imagePaths,
  };
}

function validatePayload(payload, categoryOptions, subcategoryOptions) {
  if (!payload.category_id) {
    return 'Please select a category from Collections Jewellery.';
  }

  const hasCategory = categoryOptions.some((row) => Number(row.id) === Number(payload.category_id));
  if (!hasCategory) {
    return 'Selected category is not available in Collections Jewellery.';
  }

  if (!payload.subcategory_id) {
    return 'Please select a subcategory.';
  }

  const hasSubcategory = subcategoryOptions.some((row) => Number(row.id) === Number(payload.subcategory_id));
  if (!hasSubcategory) {
    return 'Selected subcategory is not available for the chosen category.';
  }

  if (!payload.title) {
    return 'Product title is required.';
  }

  if (!payload.collection_name) {
    return 'Collection name is required.';
  }

  if (!payload.number_of_pcs) {
    return 'Number of Pcs is required.';
  }

  if (!payload.product_images || payload.product_images.length === 0) {
    return 'At least one product image is required.';
  }

  if (payload.product_images.length > MAX_PRODUCT_IMAGES) {
    return `You may upload at most ${MAX_PRODUCT_IMAGES} product images.`;
  }

  return null;
}

router.get('/products', requireLogin, async (req, res) => {
  try {
    const items = await listProducts();

    return res.render('products/index', {
      user: req.session.user,
      items,
      message: res.locals.flashMessage,
      error: res.locals.flashError,
    });
  } catch (error) {
    console.error('Failed to load products:', error);
    return res.render('products/index', {
      user: req.session.user,
      items: [],
      message: null,
      error: 'Unable to load products right now.',
    });
  }
});

router.get('/products/add', requireLogin, requireWebRole('admin'), async (req, res) => {
  const [categories, subcategories] = await Promise.all([
    listJewelsForCategorySelection().catch(() => []),
    listSubcategoriesForSelection().catch(() => []),
  ]);

  return res.render('products/add', {
    user: req.session.user,
    error: null,
    categories,
    subcategories,
    formData: {
      weight_specifications: [{ label: '', value: '' }],
      technical_specifications: [{ feature: '', details: '' }],
    },
  });
});

router.post('/products/add', requireLogin, requireWebRole('admin'), upload.array('images', 10), async (req, res) => {
  const categories = await listJewelsForCategorySelection().catch(() => []);
  const uploadedImages = normalizeImageNames((req.files || []).map((file) => file.filename));
  const payload = buildProductPayload(req.body, uploadedImages);
  const subcategories = payload.category_id
    ? await listSubcategoriesForSelectionByCategoryId(payload.category_id).catch(() => [])
    : [];
  const validationError = validatePayload(payload, categories, subcategories);

  if (validationError) {
    for (const filename of uploadedImages) {
      const absolutePath = path.join(uploadDir, filename);
      fs.unlink(absolutePath, () => {});
    }

    return res.render('products/add', {
      user: req.session.user,
      error: validationError,
      categories,
      subcategories,
      formData: payload,
    });
  }

  try {
    await createProduct(payload);
    setFlash(req, 'success', 'Product added successfully.');
    return res.redirect('/products');
  } catch (error) {
    console.error('Failed to add product:', error);
    return res.render('products/add', {
      user: req.session.user,
      error: 'Failed to add product. Please try again.',
      categories,
      subcategories,
      formData: payload,
    });
  }
});

router.get('/products/edit/:id', requireLogin, requireWebRole('admin'), async (req, res) => {
  try {
    const [item, categories] = await Promise.all([
      findProductById(req.params.id),
      listJewelsForCategorySelection(),
    ]);

    if (!item) {
      setFlash(req, 'error', 'Product not found.');
      return res.redirect('/products');
    }

    const subcategories = item && item.category_id
      ? await listSubcategoriesForSelectionByCategoryId(item.category_id).catch(() => [])
      : [];

    return res.render('products/edit', {
      user: req.session.user,
      item: enrichForForm(item),
      categories,
      subcategories,
      error: null,
    });
  } catch (error) {
    console.error('Failed to load product for editing:', error);
    setFlash(req, 'error', 'Unable to load product right now.');
    return res.redirect('/products');
  }
});

router.post('/products/edit/:id', requireLogin, requireWebRole('admin'), upload.array('images', 10), async (req, res) => {
  const { id } = req.params;
  const originalImages = normalizeImageNames(parseExistingImages(req.body.original_images));
  const existingImages = normalizeImageNames(parseExistingImages(req.body.existing_images));
  const uploadedImages = normalizeImageNames((req.files || []).map((file) => file.filename));
  const finalImages = [...existingImages, ...uploadedImages];
  const removedImages = originalImages.filter((image) => !existingImages.includes(image));

  const existingWeightRows = parseExistingRows(req.body.existing_weight_specifications);
  const existingTechnicalRows = parseExistingRows(req.body.existing_technical_specifications);

  const categories = await listJewelsForCategorySelection().catch(() => []);
  const payload = buildProductPayload(req.body, finalImages);
  const subcategories = payload.category_id
    ? await listSubcategoriesForSelectionByCategoryId(payload.category_id).catch(() => [])
    : [];
  if (!payload.weight_specifications.length && existingWeightRows.length) {
    payload.weight_specifications = existingWeightRows;
  }
  if (!payload.technical_specifications.length && existingTechnicalRows.length) {
    payload.technical_specifications = existingTechnicalRows;
  }

  const validationError = validatePayload(payload, categories, subcategories);

  if (validationError) {
    if (uploadedImages.length > 0) {
      for (const filename of uploadedImages) {
        const absolutePath = path.join(uploadDir, filename);
        fs.unlink(absolutePath, () => {});
      }
    }

    return res.render('products/edit', {
      user: req.session.user,
      item: {
        id,
        ...payload,
        product_images: finalImages,
      },
      categories,
      subcategories,
      error: validationError,
    });
  }

  try {
    await updateProductById(id, payload);

    if (removedImages.length > 0) {
      for (const filename of removedImages) {
        const absolutePath = path.join(uploadDir, filename);
        fs.unlink(absolutePath, () => {});
      }
    }

    setFlash(req, 'success', 'Product updated successfully.');
    return res.redirect('/products');
  } catch (error) {
    console.error('Failed to update product:', error);
    if (uploadedImages.length > 0) {
      for (const filename of uploadedImages) {
        const absolutePath = path.join(uploadDir, filename);
        fs.unlink(absolutePath, () => {});
      }
    }
    return res.render('products/edit', {
      user: req.session.user,
      item: {
        id,
        ...payload,
        product_images: finalImages,
      },
      categories,
      subcategories,
      error: 'Failed to update product. Please try again.',
    });
  }
});

router.post('/products/delete/:id', requireLogin, requireWebRole('admin'), async (req, res) => {
  try {
    const existing = await findProductById(req.params.id);

    await deleteProductById(req.params.id);

    if (existing && existing.product_images && existing.product_images.length > 0) {
      for (const filename of existing.product_images) {
        const absolutePath = path.join(uploadDir, filename);
        fs.unlink(absolutePath, () => {});
      }
    }

    setFlash(req, 'success', 'Product deleted successfully.');
    return res.redirect('/products');
  } catch (error) {
    console.error('Failed to delete product:', error);
    setFlash(req, 'error', 'Failed to delete product. Please try again.');
    return res.redirect('/products');
  }
});

module.exports = router;

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {
  listSubcategories,
  createSubcategory,
  findSubcategoryById,
  updateSubcategoryById,
  deleteSubcategoryById,
} = require('../models/subcategoryModel');
const { listJewelsForCategorySelection } = require('../models/jewelModel');
const { requireLogin, requireWebRole } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'jewellery');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeBase = (path.basename(file.originalname, ext) || 'subcategory-image')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 60);
    cb(null, `${safeBase}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new Error('Only image files are allowed.'));
  },
});

function setFlash(req, type, message) {
  req.session.flash = { type, message };
}

function parseCategoryId(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function isValidCollectionType(value) {
  return ['18k', '22k'].includes(String(value || '').toLowerCase());
}

function categoryMatchesCollectionType(categoryId, collectionType, categories) {
  return categories.some(
    (category) =>
      Number(category.id) === Number(categoryId) &&
      String(category.collection_type || '').toLowerCase() === String(collectionType || '').toLowerCase()
  );
}

router.get('/subcategories', requireLogin, async (req, res) => {
  try {
    const items = await listSubcategories();
    return res.render('subcategories/index', {
      user: req.session.user,
      items,
      message: res.locals.flashMessage,
      error: res.locals.flashError,
    });
  } catch (error) {
    console.error('Failed to load subcategories:', error);
    return res.render('subcategories/index', {
      user: req.session.user,
      items: [],
      message: null,
      error: 'Unable to load subcategories right now.',
    });
  }
});

router.get('/subcategories/add', requireLogin, requireWebRole('admin'), async (req, res) => {
  const categories = await listJewelsForCategorySelection().catch(() => []);

  return res.render('subcategories/add', {
    user: req.session.user,
    error: null,
    categories,
    formData: {},
  });
});

router.post('/subcategories/add', requireLogin, requireWebRole('admin'), upload.single('image'), async (req, res) => {
  const { collection_type, category, subcategory_url } = req.body;
  const categoryId = parseCategoryId(req.body.category_id);
  const categories = await listJewelsForCategorySelection().catch(() => []);

  if (!categoryId) {
    return res.render('subcategories/add', {
      user: req.session.user,
      error: 'Please select a valid parent category.',
      categories,
      formData: req.body,
    });
  }

  if (!isValidCollectionType(collection_type)) {
    return res.render('subcategories/add', {
      user: req.session.user,
      error: 'Please select a valid collection type (18 KT Jewellery or 22 KT Jewellery).',
      categories,
      formData: req.body,
    });
  }

  if (!categoryMatchesCollectionType(categoryId, collection_type, categories)) {
    return res.render('subcategories/add', {
      user: req.session.user,
      error: 'Selected parent category does not belong to the chosen collection type.',
      categories,
      formData: req.body,
    });
  }

  if (!category || !category.trim()) {
    return res.render('subcategories/add', {
      user: req.session.user,
      error: 'Subcategory name is required.',
      categories,
      formData: req.body,
    });
  }

  if (!req.file) {
    return res.render('subcategories/add', {
      user: req.session.user,
      error: 'Image is required.',
      categories,
      formData: req.body,
    });
  }

  try {
    await createSubcategory({
      category_id: categoryId,
      collection_type,
      category: category.trim(),
      subcategory_url: (subcategory_url || '').trim() || null,
      image: req.file.filename,
    });

    setFlash(req, 'success', 'Subcategory added successfully.');
    return res.redirect('/subcategories');
  } catch (error) {
    console.error('Failed to add subcategory:', error);
    return res.render('subcategories/add', {
      user: req.session.user,
      error: 'Failed to add subcategory. Please try again.',
      categories,
      formData: req.body,
    });
  }
});

router.get('/subcategories/edit/:id', requireLogin, requireWebRole('admin'), async (req, res) => {
  const categories = await listJewelsForCategorySelection().catch(() => []);

  try {
    const item = await findSubcategoryById(req.params.id);
    if (!item) {
      setFlash(req, 'error', 'Subcategory not found.');
      return res.redirect('/subcategories');
    }

    return res.render('subcategories/edit', {
      user: req.session.user,
      item,
      categories,
      error: null,
    });
  } catch (error) {
    console.error('Failed to load subcategory:', error);
    return res.redirect('/subcategories');
  }
});

router.post('/subcategories/edit/:id', requireLogin, requireWebRole('admin'), upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { collection_type, category, subcategory_url, existing_image } = req.body;
  const categoryId = parseCategoryId(req.body.category_id);
  const categories = await listJewelsForCategorySelection().catch(() => []);

  if (!categoryId) {
    const item = await findSubcategoryById(id).catch(() => ({ id, collection_type, category, image: existing_image, category_id: null }));
    return res.render('subcategories/edit', {
      user: req.session.user,
      item,
      categories,
      error: 'Please select a valid parent category.',
    });
  }

  if (!isValidCollectionType(collection_type)) {
    const item = await findSubcategoryById(id).catch(() => ({ id, collection_type, category, image: existing_image, category_id: categoryId }));
    return res.render('subcategories/edit', {
      user: req.session.user,
      item,
      categories,
      error: 'Please select a valid collection type (18 KT Jewellery or 22 KT Jewellery).',
    });
  }

  if (!categoryMatchesCollectionType(categoryId, collection_type, categories)) {
    const item = await findSubcategoryById(id).catch(() => ({ id, collection_type, category, image: existing_image, category_id: categoryId }));
    return res.render('subcategories/edit', {
      user: req.session.user,
      item,
      categories,
      error: 'Selected parent category does not belong to the chosen collection type.',
    });
  }

  if (!category || !category.trim()) {
    const item = await findSubcategoryById(id).catch(() => ({ id, collection_type, category, image: existing_image, category_id: categoryId }));
    return res.render('subcategories/edit', {
      user: req.session.user,
      item,
      categories,
      error: 'Subcategory name is required.',
    });
  }

  const imageFilename = req.file ? req.file.filename : (existing_image || null);

  if (!imageFilename) {
    const item = await findSubcategoryById(id).catch(() => ({ id, collection_type, category, image: null, category_id: categoryId }));
    return res.render('subcategories/edit', {
      user: req.session.user,
      item,
      categories,
      error: 'Image is required.',
    });
  }

  if (req.file && existing_image) {
    const oldPath = path.join(uploadDir, existing_image);
    fs.unlink(oldPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Failed to delete old subcategory image:', err);
      }
    });
  }

  try {
    await updateSubcategoryById(id, {
      category_id: categoryId,
      collection_type,
      category: category.trim(),
      subcategory_url: (subcategory_url || '').trim() || null,
      image: imageFilename,
    });

    setFlash(req, 'success', 'Subcategory updated successfully.');
    return res.redirect('/subcategories');
  } catch (error) {
    console.error('Failed to update subcategory:', error);
    const item = await findSubcategoryById(id).catch(() => ({
      id,
      collection_type,
      category,
      image: imageFilename,
      category_id: categoryId,
    }));

    return res.render('subcategories/edit', {
      user: req.session.user,
      item,
      categories,
      error: 'Failed to update subcategory. Please try again.',
    });
  }
});

router.post('/subcategories/delete/:id', requireLogin, requireWebRole('admin'), async (req, res) => {
  try {
    await deleteSubcategoryById(req.params.id);
    setFlash(req, 'success', 'Subcategory deleted successfully.');
    return res.redirect('/subcategories');
  } catch (error) {
    console.error('Failed to delete subcategory:', error);
    setFlash(req, 'error', 'Failed to delete subcategory. Please try again.');
    return res.redirect('/subcategories');
  }
});

module.exports = router;

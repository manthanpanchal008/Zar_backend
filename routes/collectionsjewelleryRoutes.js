const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {
  listJewels,
  createJewel,
  findJewelById,
  updateJewelById,
  deleteJewelById,
} = require('../models/jewelModel');
const { requireLogin, requireWebRole } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'jewellery');
fs.mkdirSync(uploadDir, { recursive: true });

function createTargetFilename(originalName) {
  const rawName = String(originalName || '').replace(/\\/g, '/');
  const baseName = path.basename(rawName) || 'collection-image';
  const ext = path.extname(baseName).toLowerCase();
  const rawBase = path.basename(baseName, ext) || 'collection-image';
  const safeBase = rawBase
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'collection-image';

  return `${safeBase}${ext}`;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, createTargetFilename(file.originalname)),
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

router.get('/collectionsjewellery', requireLogin, async (req, res) => {
  try {
    const items = await listJewels();
    return res.render('collectionsjewellery/index', {
      user: req.session.user,
      items,
      message: res.locals.flashMessage,
      error: res.locals.flashError,
    });
  } catch (error) {
    console.error('Failed to load collections jewellery:', error);
    return res.render('collectionsjewellery/index', {
      user: req.session.user,
      items: [],
      message: null,
      error: 'Unable to load collections jewellery right now.',
    });
  }
});

router.get('/collectionsjewellery/add', requireLogin, requireWebRole('admin'), (req, res) => {
  return res.render('collectionsjewellery/add', {
    user: req.session.user,
    error: null,
    formData: {},
  });
});

router.post('/collectionsjewellery/add', requireLogin, requireWebRole('admin'), upload.single('image'), async (req, res) => {
  const { collection_type, category, collection_url } = req.body;

  if (!collection_type || !['18k', '22k'].includes(collection_type)) {
    return res.render('collectionsjewellery/add', {
      user: req.session.user,
      error: 'Please select a valid collection type (18 KT Jewellery or 22 KT Jewellery).',
      formData: req.body,
    });
  }

  if (!category || !category.trim()) {
    return res.render('collectionsjewellery/add', {
      user: req.session.user,
      error: 'Category of collection is required.',
      formData: req.body,
    });
  }

  if (!req.file) {
    return res.render('collectionsjewellery/add', {
      user: req.session.user,
      error: 'Image is required.',
      formData: req.body,
    });
  }

  try {
    await createJewel({
      collection_type,
      category: category.trim(),
      collection_url: (collection_url || '').trim() || null,
      image: req.file.filename,
    });

    setFlash(req, 'success', 'Collections jewellery item added successfully.');
    return res.redirect('/collectionsjewellery');
  } catch (error) {
    console.error('Failed to add collections jewellery:', error);
    return res.render('collectionsjewellery/add', {
      user: req.session.user,
      error: 'Failed to add collections jewellery. Please try again.',
      formData: req.body,
    });
  }
});

router.get('/collectionsjewellery/edit/:id', requireLogin, requireWebRole('admin'), async (req, res) => {
  try {
    const item = await findJewelById(req.params.id);
    if (!item) {
      setFlash(req, 'error', 'Collections jewellery item not found.');
      return res.redirect('/collectionsjewellery');
    }

    return res.render('collectionsjewellery/edit', {
      user: req.session.user,
      item,
      error: null,
    });
  } catch (error) {
    console.error('Failed to load collections jewellery item:', error);
    return res.redirect('/collectionsjewellery');
  }
});

router.post('/collectionsjewellery/edit/:id', requireLogin, requireWebRole('admin'), upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { collection_type, category, collection_url, existing_image } = req.body;

  if (!collection_type || !['18k', '22k'].includes(collection_type)) {
    const item = await findJewelById(id).catch(() => ({ id, collection_type, category, image: existing_image }));
    return res.render('collectionsjewellery/edit', {
      user: req.session.user,
      item,
      error: 'Please select a valid collection type (18 KT Jewellery or 22 KT Jewellery).',
    });
  }

  if (!category || !category.trim()) {
    const item = await findJewelById(id).catch(() => ({ id, collection_type, category, image: existing_image }));
    return res.render('collectionsjewellery/edit', {
      user: req.session.user,
      item,
      error: 'Category of collection is required.',
    });
  }

  const imageFilename = req.file ? req.file.filename : (existing_image || null);

  if (!imageFilename) {
    const item = await findJewelById(id).catch(() => ({ id, collection_type, category, image: null }));
    return res.render('collectionsjewellery/edit', {
      user: req.session.user,
      item,
      error: 'Image is required.',
    });
  }

  if (req.file && existing_image) {
    const oldPath = path.join(uploadDir, existing_image);
    fs.unlink(oldPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Failed to delete old collection image:', err);
      }
    });
  }

  try {
    await updateJewelById(id, {
      collection_type,
      category: category.trim(),
      collection_url: (collection_url || '').trim() || null,
      image: imageFilename,
    });

    setFlash(req, 'success', 'Collections jewellery item updated successfully.');
    return res.redirect('/collectionsjewellery');
  } catch (error) {
    console.error('Failed to update collections jewellery:', error);
    const item = await findJewelById(id).catch(() => ({ id, collection_type, category, image: imageFilename }));
    return res.render('collectionsjewellery/edit', {
      user: req.session.user,
      item,
      error: 'Failed to update collections jewellery. Please try again.',
    });
  }
});

router.post('/collectionsjewellery/delete/:id', requireLogin, requireWebRole('admin'), async (req, res) => {
  try {
    await deleteJewelById(req.params.id);
    setFlash(req, 'success', 'Collections jewellery item deleted successfully.');
    return res.redirect('/collectionsjewellery');
  } catch (error) {
    console.error('Failed to delete collections jewellery:', error);
    setFlash(req, 'error', 'Failed to delete item. Please try again.');
    return res.redirect('/collectionsjewellery');
  }
});

module.exports = router;

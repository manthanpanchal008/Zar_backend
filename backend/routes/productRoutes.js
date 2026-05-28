const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { requireLogin, requireWebRole } = require('../middleware/auth');
const productController = require('../controllers/web/productController');

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

  return `${Date.now()}-${safeBase}${ext}`;
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

router.get('/products', requireLogin, productController.index);

router.get('/products/add', requireLogin, requireWebRole('admin'), productController.add);
router.post('/products/add', requireLogin, requireWebRole('admin'), upload.array('images', 10), productController.store);

router.get('/products/edit/:id', requireLogin, requireWebRole('admin'), productController.edit);
router.post('/products/edit/:id', requireLogin, requireWebRole('admin'), upload.array('images', 10), productController.update);

router.post('/products/delete/:id', requireLogin, requireWebRole('admin'), productController.destroy);

module.exports = router;

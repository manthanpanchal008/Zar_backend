const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { requireLogin, requireWebRole } = require('../middleware/auth');
const eventController = require('../controllers/web/eventController');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'events');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeBase = (path.basename(file.originalname, ext) || 'event-image')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 60);
    cb(null, `${safeBase}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Only image files are allowed.'));
  },
});

// ── List Events ───────────────────────────────────────────────────────────────
router.get('/events', requireLogin, eventController.index);

// ── Add Event ─────────────────────────────────────────────────────────────────
router.get('/events/add', requireLogin, requireWebRole('admin'), eventController.add);
router.post('/events/add', requireLogin, requireWebRole('admin'), upload.array('images', 10), eventController.store);

// ── Edit Event ────────────────────────────────────────────────────────────────
router.get('/events/edit/:id', requireLogin, requireWebRole('admin'), eventController.edit);
router.post('/events/edit/:id', requireLogin, requireWebRole('admin'), upload.array('images', 10), eventController.update);

// ── Delete Event ──────────────────────────────────────────────────────────────
router.post('/events/delete/:id', requireLogin, requireWebRole('admin'), eventController.destroy);

module.exports = router;

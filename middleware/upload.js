const fs = require('fs');
const path = require('path');
const multer = require('multer');

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

function createSafeFilename(originalName, fallbackName) {
  const rawName = String(originalName || '').replace(/\\/g, '/');
  const baseName = path.basename(rawName) || fallbackName;
  const ext = path.extname(baseName).toLowerCase();
  const rawBase = path.basename(baseName, ext) || fallbackName;
  const safeBase = rawBase
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || fallbackName;

  return `${Date.now()}-${safeBase}${ext}`;
}

function imageUpload(folderName, options = {}) {
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads', folderName);
  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, createSafeFilename(file.originalname, options.fallbackName || 'image')),
  });

  return multer({
    storage,
    limits: {
      fileSize: options.fileSize || 5 * 1024 * 1024,
      files: options.files || 1,
    },
    fileFilter: (_req, file, cb) => {
      if (allowedImageTypes.includes(file.mimetype)) return cb(null, true);
      return cb(new Error('Only JPG, PNG, WebP, GIF and SVG image files are allowed.'));
    },
  });
}

function handleMulterError(err, _req, res, next) {
  if (!err) return next();

  if (err instanceof multer.MulterError || /image files/.test(err.message)) {
    return res.status(400).json({ success: false, error: err.message });
  }

  return next(err);
}

module.exports = {
  imageUpload,
  handleMulterError,
};

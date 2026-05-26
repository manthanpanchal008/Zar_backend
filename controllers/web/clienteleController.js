const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {
  listClientele,
  findClienteleById,
  createClientele,
  updateClienteleById,
  deleteClienteleById,
} = require('../../models/clienteleModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'clientele');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeBase = (path.basename(file.originalname, ext) || 'clientele-image')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 60);
    cb(null, `${safeBase}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Only image files are allowed.'));
  },
});

function runUpload(req, res) {
  return new Promise((resolve) => {
    upload.single('clientele_image')(req, res, (err) => resolve(err || null));
  });
}

function setFlash(req, type, message) {
  req.session.flash = { type, message };
}

async function index(req, res) {
  try {
    const clientele = await listClientele();
    return res.render('clientele/index', {
      user: req.session.user,
      clientele,
      message: res.locals.flashMessage,
      error: res.locals.flashError,
    });
  } catch (error) {
    console.error('Failed to load clientele:', error);
    return res.render('clientele/index', {
      user: req.session.user,
      clientele: [],
      message: null,
      error: 'Unable to load clientele right now.',
    });
  }
}

function add(req, res) {
  return res.render('clientele/add', {
    user: req.session.user,
    error: null,
    formData: {},
  });
}

async function store(req, res) {
  const uploadErr = await runUpload(req, res);

  if (uploadErr) {
    return res.render('clientele/add', {
      user: req.session.user,
      error: uploadErr.message || 'File upload failed.',
      formData: req.body,
    });
  }

  const { clientele_title, country } = req.body;

  if (!clientele_title || !clientele_title.trim()) {
    return res.render('clientele/add', {
      user: req.session.user,
      error: 'Clientele title is required.',
      formData: req.body,
    });
  }

  if (!req.file) {
    return res.render('clientele/add', {
      user: req.session.user,
      error: 'Clientele image is required.',
      formData: req.body,
    });
  }

  try {
    await createClientele({
      clientele_title: clientele_title.trim(),
      clientele_image: req.file.filename,
      country: country || 'India',
    });
    setFlash(req, 'success', 'Clientele created successfully.');
    return res.redirect('/clientele');
  } catch (error) {
    console.error('Failed to create clientele:', error);
    return res.render('clientele/add', {
      user: req.session.user,
      error: 'Failed to create clientele. Please try again.',
      formData: req.body,
    });
  }
}

async function edit(req, res) {
  try {
    const clienteleItem = await findClienteleById(req.params.id);
    if (!clienteleItem) {
      setFlash(req, 'error', 'Clientele not found.');
      return res.redirect('/clientele');
    }
    return res.render('clientele/edit', {
      user: req.session.user,
      clienteleItem,
      error: res.locals.flashError,
    });
  } catch (error) {
    console.error('Failed to load clientele:', error);
    setFlash(req, 'error', 'Unable to load clientele item.');
    return res.redirect('/clientele');
  }
}

async function update(req, res) {
  const { id } = req.params;
  const uploadErr = await runUpload(req, res);

  if (uploadErr) {
    const clienteleItem = await findClienteleById(id).catch(() => null);
    return res.render('clientele/edit', {
      user: req.session.user,
      clienteleItem: clienteleItem || { id, ...req.body },
      error: uploadErr.message || 'File upload failed.',
    });
  }

  const { clientele_title, country } = req.body;

  if (!clientele_title || !clientele_title.trim()) {
    const clienteleItem = await findClienteleById(id).catch(() => null);
    return res.render('clientele/edit', {
      user: req.session.user,
      clienteleItem: clienteleItem || { id, ...req.body },
      error: 'Clientele title is required.',
    });
  }

  try {
    const current = await findClienteleById(id);
    if (!current) {
      setFlash(req, 'error', 'Clientele not found.');
      return res.redirect('/clientele');
    }

    await updateClienteleById(id, {
      clientele_title: clientele_title.trim(),
      clientele_image: req.file ? req.file.filename : current.clientele_image,
      country: country || current.country || 'India',
    });

    setFlash(req, 'success', 'Clientele updated successfully.');
    return res.redirect('/clientele');
  } catch (error) {
    console.error('Failed to update clientele:', error);
    setFlash(req, 'error', 'Update failed. Please try again.');
    return res.redirect(`/clientele/edit/${id}`);
  }
}

async function destroy(req, res) {
  try {
    await deleteClienteleById(req.params.id);
    setFlash(req, 'success', 'Clientele deleted successfully.');
    return res.redirect('/clientele');
  } catch (error) {
    console.error('Failed to delete clientele:', error);
    setFlash(req, 'error', 'Failed to delete clientele. Please try again.');
    return res.redirect('/clientele');
  }
}

module.exports = {
  index,
  add,
  store,
  edit,
  update,
  destroy,
};

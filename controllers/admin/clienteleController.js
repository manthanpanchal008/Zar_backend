const fs = require('fs');
const path = require('path');
const {
  listClientele,
  findClienteleById,
  createClientele,
  updateClienteleById,
  deleteClienteleById,
} = require('../../models/clienteleModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'clientele');

function removeUploadedFile(filename) {
  if (filename) {
    fs.unlink(path.join(uploadDir, filename), () => {});
  }
}

async function index(_req, res) {
  try {
    const items = await listClientele();
    return res.json({ success: true, items });
  } catch (error) {
    console.error('Failed to list admin clientele:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch clientele.' });
  }
}

async function show(req, res) {
  try {
    const clientele = await findClienteleById(req.params.id);
    if (!clientele) return res.status(404).json({ success: false, error: 'Clientele item not found.' });
    return res.json({ success: true, clientele });
  } catch (error) {
    console.error('Failed to fetch admin clientele item:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch clientele item.' });
  }
}

async function store(req, res) {
  const { clientele_title, country } = req.body;

  if (!clientele_title || !clientele_title.trim()) {
    if (req.file) removeUploadedFile(req.file.filename);
    return res.status(400).json({ success: false, error: 'Clientele title is required.' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Clientele image is required.' });
  }

  try {
    await createClientele({
      clientele_title: clientele_title.trim(),
      clientele_image: req.file.filename,
      country: country || 'India',
    });
    return res.status(201).json({ success: true, message: 'Clientele added successfully.' });
  } catch (error) {
    if (req.file) removeUploadedFile(req.file.filename);
    console.error('Failed to create admin clientele:', error);
    return res.status(500).json({ success: false, error: 'Failed to add clientele.' });
  }
}

async function update(req, res) {
  const existing = await findClienteleById(req.params.id);
  if (!existing) {
    if (req.file) removeUploadedFile(req.file.filename);
    return res.status(404).json({ success: false, error: 'Clientele not found.' });
  }

  const { clientele_title, country } = req.body;

  if (!clientele_title || !clientele_title.trim()) {
    if (req.file) removeUploadedFile(req.file.filename);
    return res.status(400).json({ success: false, error: 'Clientele title is required.' });
  }

  try {
    const finalImage = req.file ? req.file.filename : existing.clientele_image;
    await updateClienteleById(req.params.id, {
      clientele_title: clientele_title.trim(),
      clientele_image: finalImage,
      country: country || existing.country || 'India',
    });

    if (req.file && existing.clientele_image) {
      removeUploadedFile(existing.clientele_image);
    }

    return res.json({ success: true, message: 'Clientele updated successfully.' });
  } catch (error) {
    if (req.file) removeUploadedFile(req.file.filename);
    console.error('Failed to update admin clientele:', error);
    return res.status(500).json({ success: false, error: 'Failed to update clientele.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findClienteleById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Clientele not found.' });

    await deleteClienteleById(req.params.id);
    if (existing.clientele_image) {
      removeUploadedFile(existing.clientele_image);
    }
    return res.json({ success: true, message: 'Clientele deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete admin clientele:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete clientele.' });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};

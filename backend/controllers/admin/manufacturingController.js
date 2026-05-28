const fs = require('fs');
const path = require('path');
const {
  listManufacturing,
  createManufacturing,
  findManufacturingById,
  updateManufacturingById,
  deleteManufacturingById,
} = require('../../models/manufacturingModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'manufacturing');

// Create upload directory if it does not exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function imageUrl(image) {
  return image ? `/uploads/manufacturing/${image}` : null;
}

function serializeManufacturing(row) {
  return {
    ...row,
    isActive: !!row.is_active,
    image_url: imageUrl(row.image),
  };
}

async function index(_req, res) {
  try {
    const items = await listManufacturing();
    return res.json({ success: true, items: items.map(serializeManufacturing) });
  } catch (error) {
    console.error('Failed to list manufacturing records:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch manufacturing records.' });
  }
}

async function show(req, res) {
  try {
    const item = await findManufacturingById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Record not found.' });
    return res.json({ success: true, item: serializeManufacturing(item) });
  } catch (error) {
    console.error('Failed to show manufacturing record:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch manufacturing record.' });
  }
}

async function store(req, res) {
  const { name, description } = req.body;

  if (!String(name || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }

  try {
    const id = await createManufacturing({
      name: name.trim(),
      description: description && description.trim() ? description.trim() : null,
      image: req.file ? req.file.filename : null,
    });
    const item = await findManufacturingById(id);
    return res.status(201).json({ success: true, message: 'Record added successfully.', item: serializeManufacturing(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to create manufacturing record:', error);
    return res.status(500).json({ success: false, error: 'Failed to add manufacturing record.' });
  }
}

async function update(req, res) {
  const existing = await findManufacturingById(req.params.id);
  if (!existing) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(404).json({ success: false, error: 'Record not found.' });
  }

  const { name, description, is_active } = req.body;

  if (!String(name || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }

  const finalIsActive = is_active !== undefined ? (is_active === 'true' || is_active === '1' || is_active === true) ? 1 : 0 : existing.is_active;

  try {
    const updatedImage = req.file ? req.file.filename : existing.image;
    await updateManufacturingById(req.params.id, {
      name: name.trim(),
      description: description && description.trim() ? description.trim() : null,
      image: updatedImage,
      is_active: finalIsActive,
    });

    if (req.file && existing.image && existing.image !== req.file.filename) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }

    const item = await findManufacturingById(req.params.id);
    return res.json({ success: true, message: 'Record updated successfully.', item: serializeManufacturing(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to update manufacturing record:', error);
    return res.status(500).json({ success: false, error: 'Failed to update manufacturing record.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findManufacturingById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Record not found.' });

    await deleteManufacturingById(req.params.id);
    if (existing.image) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }
    return res.json({ success: true, message: 'Record deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete manufacturing record:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete manufacturing record.' });
  }
}

async function toggleStatus(req, res) {
  try {
    const existing = await findManufacturingById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Record not found.' });

    const nextStatus = existing.is_active ? 0 : 1;
    await updateManufacturingById(req.params.id, {
      name: existing.name,
      description: existing.description,
      image: existing.image,
      is_active: nextStatus,
    });

    return res.json({ success: true, message: 'Status updated successfully.', is_active: nextStatus, isActive: !!nextStatus });
  } catch (error) {
    console.error('Failed to toggle manufacturing status:', error);
    return res.status(500).json({ success: false, error: 'Failed to update status.' });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  toggleStatus,
};

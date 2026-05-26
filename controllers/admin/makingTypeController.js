const fs = require('fs');
const path = require('path');
const {
  listMakingTypes,
  createMakingType,
  findMakingTypeById,
  updateMakingTypeById,
  deleteMakingTypeById,
} = require('../../models/makingTypeModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'makingtypes');

function imageUrl(image) {
  return image ? `/uploads/makingtypes/${image}` : null;
}

function serializeMakingType(row) {
  return {
    ...row,
    isActive: !!row.is_active,
    image_url: imageUrl(row.image),
  };
}

async function index(_req, res) {
  try {
    const items = await listMakingTypes();
    return res.json({ success: true, items: items.map(serializeMakingType) });
  } catch (error) {
    console.error('Failed to list making types:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch making types.' });
  }
}

async function show(req, res) {
  try {
    const item = await findMakingTypeById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Making type not found.' });
    return res.json({ success: true, item: serializeMakingType(item) });
  } catch (error) {
    console.error('Failed to show making type:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch making type.' });
  }
}

async function store(req, res) {
  const { name } = req.body;

  if (!String(name || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Image is required.' });
  }

  try {
    const id = await createMakingType({
      name: name.trim(),
      image: req.file.filename,
    });
    const item = await findMakingTypeById(id);
    return res.status(201).json({ success: true, message: 'Making type added successfully.', item: serializeMakingType(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to create making type:', error);
    return res.status(500).json({ success: false, error: 'Failed to add making type.' });
  }
}

async function update(req, res) {
  const existing = await findMakingTypeById(req.params.id);
  if (!existing) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(404).json({ success: false, error: 'Making type not found.' });
  }

  const { name, is_active } = req.body;

  if (!String(name || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }

  const finalIsActive = is_active !== undefined ? (is_active === 'true' || is_active === '1' || is_active === true) ? 1 : 0 : existing.is_active;

  try {
    const updatedImage = req.file ? req.file.filename : existing.image;
    await updateMakingTypeById(req.params.id, {
      name: name.trim(),
      image: updatedImage,
      is_active: finalIsActive,
    });

    if (req.file && existing.image && existing.image !== req.file.filename) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }

    const item = await findMakingTypeById(req.params.id);
    return res.json({ success: true, message: 'Making type updated successfully.', item: serializeMakingType(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to update making type:', error);
    return res.status(500).json({ success: false, error: 'Failed to update making type.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findMakingTypeById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Making type not found.' });

    await deleteMakingTypeById(req.params.id);
    if (existing.image) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }
    return res.json({ success: true, message: 'Making type deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete making type:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete making type.' });
  }
}

async function toggleStatus(req, res) {
  try {
    const existing = await findMakingTypeById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Making type not found.' });

    const nextStatus = existing.is_active ? 0 : 1;
    await updateMakingTypeById(req.params.id, {
      name: existing.name,
      image: existing.image,
      is_active: nextStatus,
    });

    return res.json({ success: true, message: 'Status updated successfully.', is_active: nextStatus, isActive: !!nextStatus });
  } catch (error) {
    console.error('Failed to toggle making type status:', error);
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

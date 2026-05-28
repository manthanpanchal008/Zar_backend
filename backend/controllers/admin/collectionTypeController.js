const fs = require('fs');
const path = require('path');
const {
  listCollectionTypes,
  createCollectionType,
  findCollectionTypeById,
  updateCollectionTypeById,
  deleteCollectionTypeById,
} = require('../../models/collectionTypeModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'makingtypes'); // Keep same directory name to preserve uploads compatibility

function imageUrl(image) {
  return image ? `/uploads/makingtypes/${image}` : null;
}

function serializeCollectionType(row) {
  return {
    ...row,
    isActive: !!row.is_active,
    image_url: imageUrl(row.image),
  };
}

async function index(_req, res) {
  try {
    const items = await listCollectionTypes();
    return res.json({ success: true, items: items.map(serializeCollectionType) });
  } catch (error) {
    console.error('Failed to list collection types:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch collection types.' });
  }
}

async function show(req, res) {
  try {
    const item = await findCollectionTypeById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Collection type not found.' });
    return res.json({ success: true, item: serializeCollectionType(item) });
  } catch (error) {
    console.error('Failed to show collection type:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch collection type.' });
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
    const id = await createCollectionType({
      name: name.trim(),
      image: req.file.filename,
    });
    const item = await findCollectionTypeById(id);
    return res.status(201).json({ success: true, message: 'Collection type added successfully.', item: serializeCollectionType(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to create collection type:', error);
    return res.status(500).json({ success: false, error: 'Failed to add collection type.' });
  }
}

async function update(req, res) {
  const existing = await findCollectionTypeById(req.params.id);
  if (!existing) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(404).json({ success: false, error: 'Collection type not found.' });
  }

  const { name, is_active } = req.body;

  if (!String(name || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }

  const finalIsActive = is_active !== undefined ? (is_active === 'true' || is_active === '1' || is_active === true) ? 1 : 0 : existing.is_active;

  try {
    const updatedImage = req.file ? req.file.filename : existing.image;
    await updateCollectionTypeById(req.params.id, {
      name: name.trim(),
      image: updatedImage,
      is_active: finalIsActive,
    });

    if (req.file && existing.image && existing.image !== req.file.filename) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }

    const item = await findCollectionTypeById(req.params.id);
    return res.json({ success: true, message: 'Collection type updated successfully.', item: serializeCollectionType(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to update collection type:', error);
    return res.status(500).json({ success: false, error: 'Failed to update collection type.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findCollectionTypeById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Collection type not found.' });

    await deleteCollectionTypeById(req.params.id);
    if (existing.image) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }
    return res.json({ success: true, message: 'Collection type deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete collection type:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete collection type.' });
  }
}

async function toggleStatus(req, res) {
  try {
    const existing = await findCollectionTypeById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Collection type not found.' });

    const nextStatus = existing.is_active ? 0 : 1;
    await updateCollectionTypeById(req.params.id, {
      name: existing.name,
      image: existing.image,
      is_active: nextStatus,
    });

    return res.json({ success: true, message: 'Status updated successfully.', is_active: nextStatus, isActive: !!nextStatus });
  } catch (error) {
    console.error('Failed to toggle collection type status:', error);
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

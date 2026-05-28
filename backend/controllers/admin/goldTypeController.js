const fs = require('fs');
const path = require('path');
const {
  listGoldTypes,
  createGoldType,
  findGoldTypeById,
  updateGoldTypeById,
  deleteGoldTypeById,
} = require('../../models/goldTypeModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'goldtypes');

function imageUrl(image) {
  return image ? `/uploads/goldtypes/${image}` : null;
}

function serializeGoldType(row) {
  return {
    ...row,
    isActive: !!row.is_active,
    image_url: imageUrl(row.image),
  };
}

async function index(_req, res) {
  try {
    const items = await listGoldTypes();
    return res.json({ success: true, items: items.map(serializeGoldType) });
  } catch (error) {
    console.error('Failed to list gold types:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch gold types.' });
  }
}

async function show(req, res) {
  try {
    const item = await findGoldTypeById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Gold type not found.' });
    return res.json({ success: true, item: serializeGoldType(item) });
  } catch (error) {
    console.error('Failed to show gold type:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch gold type.' });
  }
}

async function store(req, res) {
  const { name, purity } = req.body;

  if (!String(name || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Name is required (e.g. 22K).' });
  }

  const purityNum = Number.parseFloat(String(purity || ''));
  if (Number.isNaN(purityNum) || purityNum <= 0 || purityNum > 100) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Purity must be a valid percentage between 0 and 100.' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Image is required.' });
  }

  try {
    const id = await createGoldType({
      name: name.trim(),
      purity: purityNum,
      image: req.file.filename,
    });
    const item = await findGoldTypeById(id);
    return res.status(201).json({ success: true, message: 'Gold type added successfully.', item: serializeGoldType(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to create gold type:', error);
    return res.status(500).json({ success: false, error: 'Failed to add gold type.' });
  }
}

async function update(req, res) {
  const existing = await findGoldTypeById(req.params.id);
  if (!existing) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(404).json({ success: false, error: 'Gold type not found.' });
  }

  const { name, purity, is_active } = req.body;

  if (!String(name || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }

  const purityNum = Number.parseFloat(String(purity || ''));
  if (Number.isNaN(purityNum) || purityNum <= 0 || purityNum > 100) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Purity must be a valid percentage.' });
  }

  const finalIsActive = is_active !== undefined ? (is_active === 'true' || is_active === '1' || is_active === true) ? 1 : 0 : existing.is_active;

  try {
    const updatedImage = req.file ? req.file.filename : existing.image;
    await updateGoldTypeById(req.params.id, {
      name: name.trim(),
      purity: purityNum,
      image: updatedImage,
      is_active: finalIsActive,
    });

    if (req.file && existing.image && existing.image !== req.file.filename) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }

    const item = await findGoldTypeById(req.params.id);
    return res.json({ success: true, message: 'Gold type updated successfully.', item: serializeGoldType(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to update gold type:', error);
    return res.status(500).json({ success: false, error: 'Failed to update gold type.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findGoldTypeById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Gold type not found.' });

    await deleteGoldTypeById(req.params.id);
    if (existing.image) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }
    return res.json({ success: true, message: 'Gold type deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete gold type:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete gold type.' });
  }
}

async function toggleStatus(req, res) {
  try {
    const existing = await findGoldTypeById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Gold type not found.' });

    const nextStatus = existing.is_active ? 0 : 1;
    await updateGoldTypeById(req.params.id, {
      name: existing.name,
      purity: existing.purity,
      image: existing.image,
      is_active: nextStatus,
    });

    return res.json({ success: true, message: 'Status updated successfully.', is_active: nextStatus, isActive: !!nextStatus });
  } catch (error) {
    console.error('Failed to toggle gold type status:', error);
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

const fs = require('fs');
const path = require('path');
const {
  listJourneys,
  findJourneyById,
  createJourney,
  updateJourneyById,
  deleteJourneyById,
} = require('../../models/zarJourneyModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'zar_journey');

function imageUrl(image) {
  return image ? `/uploads/zar_journey/${image}` : null;
}

function serializeJourney(row) {
  return {
    ...row,
    image_url: imageUrl(row.image),
  };
}

async function index(_req, res) {
  try {
    const items = await listJourneys();
    return res.json({ success: true, items: items.map(serializeJourney) });
  } catch (error) {
    console.error('Failed to list journeys:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch journeys.' });
  }
}

async function show(req, res) {
  try {
    const item = await findJourneyById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Journey not found.' });
    return res.json({ success: true, item: serializeJourney(item) });
  } catch (error) {
    console.error('Failed to show journey:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch journey.' });
  }
}

async function store(req, res) {
  const { year, description } = req.body;

  if (!year) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Year is required.' });
  }

  if (!String(description || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Description is required.' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Image is required.' });
  }

  try {
    const id = await createJourney({
      year: parseInt(year, 10),
      description: description.trim(),
      image: req.file.filename,
    });

    const item = await findJourneyById(id);
    return res.status(201).json({ success: true, message: 'Journey added successfully.', item: serializeJourney(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to create journey:', error);
    return res.status(500).json({ success: false, error: 'Failed to add journey.' });
  }
}

async function update(req, res) {
  const existing = await findJourneyById(req.params.id);
  if (!existing) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(404).json({ success: false, error: 'Journey not found.' });
  }

  const { year, description } = req.body;

  if (!year) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Year is required.' });
  }

  if (!String(description || '').trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Description is required.' });
  }

  try {
    const updatedImage = req.file ? req.file.filename : existing.image;
    await updateJourneyById(req.params.id, {
      year: parseInt(year, 10),
      description: description.trim(),
      image: updatedImage,
    });

    if (req.file && existing.image && existing.image !== req.file.filename) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }

    const item = await findJourneyById(req.params.id);
    return res.json({ success: true, message: 'Journey updated successfully.', item: serializeJourney(item) });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to update journey:', error);
    return res.status(500).json({ success: false, error: 'Failed to update journey.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findJourneyById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Journey not found.' });

    await deleteJourneyById(req.params.id);
    if (existing.image) {
      fs.unlink(path.join(uploadDir, existing.image), () => {});
    }
    return res.json({ success: true, message: 'Journey deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete journey:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete journey.' });
  }
}

async function publicList(_req, res) {
  try {
    const items = await listJourneys();
    return res.json({ success: true, items: items.map(serializeJourney) });
  } catch (error) {
    console.error('Failed to list public journeys:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch journeys.' });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  publicList,
};

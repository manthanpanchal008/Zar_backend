const {
  listCareers,
  findCareerById,
  createCareer,
  updateCareerById,
  deleteCareerById,
} = require('../../models/careerModel');

async function index(_req, res) {
  try {
    const items = await listCareers();
    return res.json({ success: true, items });
  } catch (error) {
    console.error('Failed to list careers:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch careers.' });
  }
}

async function show(req, res) {
  try {
    const item = await findCareerById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Career post not found.' });
    }
    return res.json({ success: true, item });
  } catch (error) {
    console.error('Failed to fetch career post:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch career post.' });
  }
}

async function store(req, res) {
  const { position, experience, location, jobDescription } = req.body;

  if (!position || !position.trim()) {
    return res.status(400).json({ success: false, error: 'Position is required.' });
  }

  if (!experience || !experience.trim()) {
    return res.status(400).json({ success: false, error: 'Experience requirement is required.' });
  }

  if (!location || !location.trim()) {
    return res.status(400).json({ success: false, error: 'Location is required.' });
  }

  if (!jobDescription || !jobDescription.trim()) {
    return res.status(400).json({ success: false, error: 'Job description is required.' });
  }

  try {
    const id = await createCareer({
      position: position.trim(),
      experience: experience.trim(),
      location: location.trim(),
      jobDescription: jobDescription.trim(),
    });

    const item = await findCareerById(id);
    return res.status(201).json({
      success: true,
      message: 'Career post created successfully.',
      item,
    });
  } catch (error) {
    console.error('Failed to create career post:', error);
    return res.status(500).json({ success: false, error: 'Failed to create career post.' });
  }
}

async function update(req, res) {
  try {
    const existing = await findCareerById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Career post not found.' });
    }

    const { position, experience, location, jobDescription } = req.body;

    if (!position || !position.trim()) {
      return res.status(400).json({ success: false, error: 'Position is required.' });
    }

    if (!experience || !experience.trim()) {
      return res.status(400).json({ success: false, error: 'Experience requirement is required.' });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({ success: false, error: 'Location is required.' });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ success: false, error: 'Job description is required.' });
    }

    await updateCareerById(req.params.id, {
      position: position.trim(),
      experience: experience.trim(),
      location: location.trim(),
      jobDescription: jobDescription.trim(),
    });

    const item = await findCareerById(req.params.id);
    return res.json({
      success: true,
      message: 'Career post updated successfully.',
      item,
    });
  } catch (error) {
    console.error('Failed to update career post:', error);
    return res.status(500).json({ success: false, error: 'Failed to update career post.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findCareerById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Career post not found.' });
    }

    await deleteCareerById(req.params.id);
    return res.json({ success: true, message: 'Career post deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete career post:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete career post.' });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};

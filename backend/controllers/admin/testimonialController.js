const {
  listTestimonials,
  findTestimonialById,
  createTestimonial,
  updateTestimonialById,
  deleteTestimonialById,
} = require('../../models/testimonialModel');

async function index(_req, res) {
  try {
    const items = await listTestimonials();
    return res.json({ success: true, items });
  } catch (error) {
    console.error('Failed to list testimonials:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch testimonials.' });
  }
}

async function show(req, res) {
  try {
    const item = await findTestimonialById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Testimonial not found.' });
    }
    return res.json({ success: true, item });
  } catch (error) {
    console.error('Failed to fetch testimonial:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch testimonial.' });
  }
}

async function store(req, res) {
  const { name, comment, position, companyName } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Name is required.' });
  }

  if (!comment || !comment.trim()) {
    return res.status(400).json({ success: false, error: 'Comment is required.' });
  }

  try {
    const id = await createTestimonial({
      name: name.trim(),
      comment: comment.trim(),
      position: position ? position.trim() : null,
      companyName: companyName ? companyName.trim() : null,
    });

    const item = await findTestimonialById(id);
    return res.status(201).json({
      success: true,
      message: 'Testimonial created successfully.',
      item,
    });
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return res.status(500).json({ success: false, error: 'Failed to create testimonial.' });
  }
}

async function update(req, res) {
  try {
    const existing = await findTestimonialById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Testimonial not found.' });
    }

    const { name, comment, position, companyName } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required.' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, error: 'Comment is required.' });
    }

    await updateTestimonialById(req.params.id, {
      name: name.trim(),
      comment: comment.trim(),
      position: position ? position.trim() : null,
      companyName: companyName ? companyName.trim() : null,
    });

    const item = await findTestimonialById(req.params.id);
    return res.json({
      success: true,
      message: 'Testimonial updated successfully.',
      item,
    });
  } catch (error) {
    console.error('Failed to update testimonial:', error);
    return res.status(500).json({ success: false, error: 'Failed to update testimonial.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findTestimonialById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Testimonial not found.' });
    }

    await deleteTestimonialById(req.params.id);
    return res.json({ success: true, message: 'Testimonial deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete testimonial.' });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};

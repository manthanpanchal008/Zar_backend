const fs = require('fs');
const path = require('path');
const {
  listEvents,
  findEventById,
  createEvent,
  updateEventById,
  deleteEventById,
} = require('../../models/eventModel');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'events');

function normalizeToArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function normalizeImageName(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  return path.posix.basename(raw.split('?')[0].split('#')[0].replace(/\\/g, '/')) || null;
}

function normalizeImageNames(values) {
  return normalizeToArray(values).map(normalizeImageName).filter(Boolean);
}

function removeUploadedFiles(files) {
  for (const filename of normalizeImageNames(files)) {
    fs.unlink(path.join(uploadDir, filename), () => {});
  }
}

function slugifyLinkText(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeEventLink(rawValue) {
  if (!rawValue || !String(rawValue).trim()) return null;

  const value = String(rawValue).trim();

  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return value;
  if (/^event\//i.test(value)) return `/${value}`;

  const slug = slugifyLinkText(value);
  return slug ? `/event/${slug}` : null;
}

function calculateEventStatus(startDateStr, endDateStr) {
  if (!startDateStr) return 'upcoming';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);

  const end = endDateStr ? new Date(endDateStr) : null;
  if (end) {
    end.setHours(0, 0, 0, 0);
  }

  if (start > today) {
    return 'upcoming';
  }

  if (end && end < today) {
    return 'past';
  }

  if (!end && start < today) {
    return 'past';
  }

  return 'ongoing';
}

async function index(_req, res) {
  try {
    const items = await listEvents();
    return res.json({ success: true, items });
  } catch (error) {
    console.error('Failed to list admin events:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch events.' });
  }
}

async function show(req, res) {
  try {
    const event = await findEventById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found.' });
    return res.json({ success: true, event });
  } catch (error) {
    console.error('Failed to fetch admin event:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch event.' });
  }
}

async function store(req, res) {
  const uploadedImages = normalizeImageNames((req.files || []).map((file) => file.filename));
  const { title, location, start_date, end_date, description, event_url } = req.body;

  if (!title || !title.trim()) {
    removeUploadedFiles(uploadedImages);
    return res.status(400).json({ success: false, error: 'Event title is required.' });
  }

  if (start_date && end_date) {
    if (new Date(end_date) < new Date(start_date)) {
      removeUploadedFiles(uploadedImages);
      return res.status(400).json({ success: false, error: 'End date cannot be earlier than start date.' });
    }
  }

  const calculatedStatus = calculateEventStatus(start_date, end_date);

  try {
    await createEvent({
      title: title.trim(),
      location: location && location.trim() ? location.trim() : null,
      start_date: start_date || null,
      end_date: end_date || null,
      description: description && description.trim() ? description.trim() : null,
      event_image: uploadedImages,
      event_url: normalizeEventLink(event_url),
      status: calculatedStatus,
    });
    return res.status(201).json({ success: true, message: 'Event created successfully.' });
  } catch (error) {
    removeUploadedFiles(uploadedImages);
    console.error('Failed to create admin event:', error);
    return res.status(500).json({ success: false, error: 'Failed to add event.' });
  }
}

async function update(req, res) {
  const existing = await findEventById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, error: 'Event not found.' });

  const keptImages = normalizeImageNames(parseJsonArray(req.body.existing_images));
  const uploadedImages = normalizeImageNames((req.files || []).map((file) => file.filename));
  const finalImages = [...keptImages, ...uploadedImages];

  const { title, location, start_date, end_date, description, event_url } = req.body;

  if (!title || !title.trim()) {
    removeUploadedFiles(uploadedImages);
    return res.status(400).json({ success: false, error: 'Event title is required.' });
  }

  if (start_date && end_date) {
    if (new Date(end_date) < new Date(start_date)) {
      removeUploadedFiles(uploadedImages);
      return res.status(400).json({ success: false, error: 'End date cannot be earlier than start date.' });
    }
  }

  const calculatedStatus = calculateEventStatus(start_date, end_date);

  try {
    await updateEventById(req.params.id, {
      title: title.trim(),
      location: location && location.trim() ? location.trim() : null,
      start_date: start_date || null,
      end_date: end_date || null,
      description: description && description.trim() ? description.trim() : null,
      event_image: finalImages,
      event_url: normalizeEventLink(event_url),
      status: calculatedStatus,
    });

    const removedImages = normalizeImageNames(existing.event_image).filter((image) => !keptImages.includes(image));
    removeUploadedFiles(removedImages);

    return res.json({ success: true, message: 'Event updated successfully.' });
  } catch (error) {
    removeUploadedFiles(uploadedImages);
    console.error('Failed to update admin event:', error);
    return res.status(500).json({ success: false, error: 'Failed to update event.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findEventById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Event not found.' });

    await deleteEventById(req.params.id);
    removeUploadedFiles(existing.event_image);
    return res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete admin event:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete event.' });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};

const pool = require('../config/db');

function parseJsonArray(rawValue) {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function normalizeStoredFileName(value) {
  if (!value) return null;

  const normalized = String(value)
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    .pop();

  return normalized || null;
}

function toPublicImageUrl(fileName) {
  return fileName ? `/uploads/events/${fileName}` : null;
}

function withParsedImages(row) {
  const eventImages = parseJsonArray(row.event_image)
    .map(normalizeStoredFileName)
    .filter(Boolean);

  return {
    ...row,
    event_image: eventImages,
    image_urls: eventImages.map(toPublicImageUrl),
  };
}

async function listEvents() {
  const [rows] = await pool.execute(
    'SELECT id, title, location, start_date, end_date, description, event_image, event_url, status FROM events WHERE deleted_at IS NULL ORDER BY start_date DESC'
  );
  return rows.map(withParsedImages);
}

async function findEventById(id) {
  const [rows] = await pool.execute(
    'SELECT id, title, location, start_date, end_date, description, event_image, event_url, status FROM events WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] ? withParsedImages(rows[0]) : null;
}

async function createEvent({ title, location, start_date, end_date, description, event_image, event_url, status }) {
  await pool.execute(
    'INSERT INTO events (title, location, start_date, end_date, description, event_image, event_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      title,
      location || null,
      start_date || null,
      end_date || null,
      description || null,
      JSON.stringify(Array.isArray(event_image) ? event_image.map(normalizeStoredFileName).filter(Boolean) : []),
      event_url || null,
      status,
    ]
  );
}

async function updateEventById(id, { title, location, start_date, end_date, description, event_image, event_url, status }) {
  await pool.execute(
    'UPDATE events SET title = ?, location = ?, start_date = ?, end_date = ?, description = ?, event_image = ?, event_url = ?, status = ? WHERE id = ?',
    [
      title,
      location || null,
      start_date || null,
      end_date || null,
      description || null,
      JSON.stringify(Array.isArray(event_image) ? event_image.map(normalizeStoredFileName).filter(Boolean) : []),
      event_url || null,
      status,
      id,
    ]
  );
}

async function deleteEventById(id) {
  await pool.execute('UPDATE events SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL', [id]);
}

async function countEvents() {
  const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM events WHERE deleted_at IS NULL');
  return Number(rows[0]?.total || 0);
}

module.exports = {
  listEvents,
  findEventById,
  createEvent,
  updateEventById,
  deleteEventById,
  countEvents,
};

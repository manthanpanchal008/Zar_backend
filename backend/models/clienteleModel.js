const pool = require('../config/db');

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
  return fileName ? `/uploads/clientele/${fileName}` : null;
}

function withImageUrl(row) {
  const fileName = normalizeStoredFileName(row.clientele_image);
  return {
    ...row,
    clientele_image: fileName,
    image_url: toPublicImageUrl(fileName),
  };
}

async function listClientele() {
  const [rows] = await pool.execute(
    'SELECT id, clientele_title, clientele_image, country, created_at, updated_at FROM clientele WHERE deleted_at IS NULL ORDER BY created_at DESC'
  );
  return rows.map(withImageUrl);
}

async function findClienteleById(id) {
  const [rows] = await pool.execute(
    'SELECT id, clientele_title, clientele_image, country, created_at, updated_at FROM clientele WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0] ? withImageUrl(rows[0]) : null;
}

async function createClientele({ clientele_title, clientele_image, country }) {
  try {
    console.log('Inserting:', { clientele_title, clientele_image, country });
    const [result] = await pool.execute(
      'INSERT INTO clientele (clientele_title, clientele_image, country) VALUES (?, ?, ?)',
      [
        clientele_title,
        normalizeStoredFileName(clientele_image),
        country || 'India',
      ]
    );
    return result;
  } catch (err) {
    console.error('SQL Insert Error:', err);
    throw err;
  }
}

async function updateClienteleById(id, { clientele_title, clientele_image, country }) {
  const [result] = await pool.execute(
    'UPDATE clientele SET clientele_title = ?, clientele_image = ?, country = ? WHERE id = ? AND deleted_at IS NULL',
    [
      clientele_title,
      normalizeStoredFileName(clientele_image),
      country || 'India',
      id,
    ]
  );
  return result;
}

async function deleteClienteleById(id) {
  await pool.execute(
    'UPDATE clientele SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
}

module.exports = {
  listClientele,
  findClienteleById,
  createClientele,
  updateClienteleById,
  deleteClienteleById,
};
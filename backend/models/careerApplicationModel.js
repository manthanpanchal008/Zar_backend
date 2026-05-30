const pool = require('../config/db');

async function listApplications() {
  const [rows] = await pool.execute(
    'SELECT id, fullName, companyName, role, workExperience, email, contactNumber, cvFile, created_at, updated_at FROM career_applications ORDER BY id DESC'
  );
  return rows;
}

async function findApplicationById(id) {
  const [rows] = await pool.execute(
    'SELECT id, fullName, companyName, role, workExperience, email, contactNumber, cvFile, created_at, updated_at FROM career_applications WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createApplication({
  fullName,
  companyName,
  role,
  workExperience,
  email,
  contactNumber,
  cvFile,
}) {
  const [result] = await pool.execute(
    'INSERT INTO career_applications (fullName, companyName, role, workExperience, email, contactNumber, cvFile) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      fullName,
      companyName,
      role,
      workExperience,
      email,
      contactNumber,
      cvFile,
    ]
  );
  return result.insertId;
}

async function deleteApplicationById(id) {
  await pool.execute('DELETE FROM career_applications WHERE id = ?', [id]);
}

module.exports = {
  listApplications,
  findApplicationById,
  createApplication,
  deleteApplicationById,
};

const fs = require('fs');
const path = require('path');
const {
  listApplications,
  findApplicationById,
  createApplication,
  deleteApplicationById,
} = require('../../models/careerApplicationModel');

const {
  sendCareerApplicationAdminMail,
  sendCareerApplicationUserThankYouMail,
} = require('../../services/mailService');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'cvs');

async function index(_req, res) {
  try {
    const items = await listApplications();
    return res.json({ success: true, items });
  } catch (error) {
    console.error('Failed to list career applications:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch career applications.' });
  }
}

async function show(req, res) {
  try {
    const item = await findApplicationById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Application not found.' });
    return res.json({ success: true, item });
  } catch (error) {
    console.error('Failed to show career application:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch career application.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findApplicationById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Application not found.' });

    await deleteApplicationById(req.params.id);

    if (existing.cvFile) {
      fs.unlink(path.join(uploadDir, existing.cvFile), (err) => {
        if (err) console.error('Failed to delete CV file:', err);
      });
    }

    return res.json({ success: true, message: 'Application deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete career application:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete career application.' });
  }
}

async function store(req, res) {
  const {
    fullName,
    companyName,
    role,
    workExperience,
    email,
    contactNumber,
  } = req.body;

  // Validate CV file upload first
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'CV file is required.' });
  }

  const cvFile = req.file.filename;

  // Validations
  if (!fullName || !String(fullName).trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Full name is required.' });
  }
  if (!companyName || !String(companyName).trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Company name is required.' });
  }
  if (!role || !String(role).trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Role is required.' });
  }
  if (!workExperience || !String(workExperience).trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Work experience details are required.' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'A valid email is required.' });
  }
  if (!contactNumber || !/^[+0-9\s-]{7,20}$/.test(contactNumber)) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'A valid contact number is required.' });
  }

  try {
    const payload = {
      fullName: String(fullName).replace(/<[^>]*>/g, '').trim(),
      companyName: String(companyName).replace(/<[^>]*>/g, '').trim(),
      role: String(role).replace(/<[^>]*>/g, '').trim(),
      workExperience: String(workExperience).replace(/<[^>]*>/g, '').trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      cvFile,
    };

    const id = await createApplication(payload);

    // Send emails
    try {
      await sendCareerApplicationAdminMail(payload, req.file.path, req.file.originalname);
    } catch (mailErr) {
      console.error('Failed to send HR career alert email:', mailErr);
    }

    try {
      await sendCareerApplicationUserThankYouMail(payload.email, payload.fullName, payload.role);
    } catch (mailErr) {
      console.error('Failed to send recruitment thank you email:', mailErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      id,
    });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Failed to submit career application:', error);
    return res.status(500).json({ success: false, error: 'Failed to process career application.' });
  }
}

module.exports = {
  index,
  show,
  destroy,
  store,
};

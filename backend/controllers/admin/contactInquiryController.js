const {
  listInquiries,
  findInquiryById,
  createInquiry,
  deleteInquiryById,
} = require('../../models/contactInquiryModel');

const {
  sendContactInquiryAdminMail,
  sendContactInquiryUserThankYouMail,
} = require('../../services/mailService');

async function index(_req, res) {
  try {
    const items = await listInquiries();
    return res.json({ success: true, items });
  } catch (error) {
    console.error('Failed to list contact inquiries:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch contact inquiries.' });
  }
}

async function show(req, res) {
  try {
    const item = await findInquiryById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Inquiry not found.' });
    return res.json({ success: true, item });
  } catch (error) {
    console.error('Failed to show contact inquiry:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch contact inquiry.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findInquiryById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Inquiry not found.' });

    await deleteInquiryById(req.params.id);
    return res.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete contact inquiry:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete contact inquiry.' });
  }
}

async function store(req, res) {
  const {
    fullName,
    companyName,
    email,
    contactNumber,
    inquiryType,
    message,
  } = req.body;

  // Validations
  if (!fullName || !String(fullName).trim()) {
    return res.status(400).json({ success: false, error: 'Full name is required.' });
  }
  if (!companyName || !String(companyName).trim()) {
    return res.status(400).json({ success: false, error: 'Company name is required.' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'A valid email is required.' });
  }
  if (!contactNumber || !/^[+0-9\s-]{7,20}$/.test(contactNumber)) {
    return res.status(400).json({ success: false, error: 'A valid contact number is required.' });
  }
  if (!inquiryType || !String(inquiryType).trim()) {
    return res.status(400).json({ success: false, error: 'Inquiry type is required.' });
  }
  if (!message || !String(message).trim()) {
    return res.status(400).json({ success: false, error: 'Message is required.' });
  }

  try {
    const payload = {
      fullName: String(fullName).replace(/<[^>]*>/g, '').trim(),
      companyName: String(companyName).replace(/<[^>]*>/g, '').trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      inquiryType: String(inquiryType).replace(/<[^>]*>/g, '').trim(),
      message: String(message).trim(),
    };

    const id = await createInquiry(payload);

    try {
      await sendContactInquiryAdminMail(payload);
    } catch (mailErr) {
      console.error('Failed to send admin inquiry email:', mailErr);
    }

    try {
      await sendContactInquiryUserThankYouMail(payload.email, payload.fullName);
    } catch (mailErr) {
      console.error('Failed to send thank you email to user:', mailErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully.',
      id,
    });
  } catch (error) {
    console.error('Failed to submit contact inquiry:', error);
    return res.status(500).json({ success: false, error: 'Failed to process contact inquiry.' });
  }
}

module.exports = {
  index,
  show,
  destroy,
  store,
};

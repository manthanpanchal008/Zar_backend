const {
  listConnections,
  findConnectionById,
  createConnection,
  deleteConnectionById,
} = require('../../models/buildConnectionModel');

const {
  sendConnectionAdminEmail,
  sendConnectionUserThankYouEmail,
} = require('../../services/mailService');

async function index(_req, res) {
  try {
    const items = await listConnections();
    return res.json({ success: true, items });
  } catch (error) {
    console.error('Failed to list connections:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch connections.' });
  }
}

async function show(req, res) {
  try {
    const item = await findConnectionById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Connection not found.' });
    return res.json({ success: true, item });
  } catch (error) {
    console.error('Failed to show connection:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch connection.' });
  }
}

async function destroy(req, res) {
  try {
    const existing = await findConnectionById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Connection not found.' });

    await deleteConnectionById(req.params.id);
    return res.json({ success: true, message: 'Connection deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete connection:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete connection.' });
  }
}

async function store(req, res) {
  const {
    fullName,
    companyName,
    email,
    country,
    state,
    city,
    pincode,
    contact,
    category,
    referredBy,
    companyWebsite,
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
  if (!country || !['India', 'Others'].includes(country)) {
    return res.status(400).json({ success: false, error: 'Country must be India or Others.' });
  }
  if (!pincode || !/^[a-zA-Z0-9\s-]{3,10}$/.test(pincode)) {
    return res.status(400).json({ success: false, error: 'A valid pincode is required.' });
  }
  if (!contact || !/^[+0-9\s-]{7,20}$/.test(contact)) {
    return res.status(400).json({ success: false, error: 'A valid contact number is required.' });
  }
  if (!category || !['Distributor', 'Retailers', 'Wholesaler'].includes(category)) {
    return res.status(400).json({ success: false, error: 'Category must be Distributor, Retailers, or Wholesaler.' });
  }
  if (companyWebsite && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(companyWebsite)) {
    return res.status(400).json({ success: false, error: 'Company website must be a valid URL.' });
  }

  try {
    const payload = {
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      country,
      state: state ? String(state).replace(/<[^>]*>/g, '').trim() : '',
      city: city ? String(city).replace(/<[^>]*>/g, '').trim() : '',
      pincode: pincode.trim(),
      contact: contact.trim(),
      category,
      referredBy: referredBy ? referredBy.trim() : null,
      companyWebsite: companyWebsite ? companyWebsite.trim() : null,
      message: message ? message.trim() : null,
    };

    const id = await createConnection(payload);

    try {
      await sendConnectionAdminEmail(payload);
    } catch (mailErr) {
      console.error('Failed to send admin lead email:', mailErr);
    }

    try {
      await sendConnectionUserThankYouEmail(payload.email, payload.fullName);
    } catch (mailErr) {
      console.error('Failed to send thank you email to user:', mailErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Connection request submitted successfully.',
      id,
    });
  } catch (error) {
    console.error('Failed to submit connection request:', error);
    return res.status(500).json({ success: false, error: 'Failed to process connection request.' });
  }
}

module.exports = {
  index,
  show,
  destroy,
  store,
};

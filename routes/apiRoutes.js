const express = require('express');
const { listUsers } = require('../models/userModel');
const { listContacts, createContact } = require('../models/contactModel');
const { listJewelsByCollectionType, listDistinctJewelCategories, listJewelsForCategorySelection } = require('../models/jewelModel');
const {
  listSubcategoriesByCollectionAndCategory,
  listSubcategoriesForSelectionByCategoryId,
} = require('../models/subcategoryModel');
const {
  listProducts,
  listProductsByCategory,
  listProductsByCategoryAndSubcategory,
  findProductById,
} = require('../models/productModel');
const { requireApiLogin, requireApiRole } = require('../middleware/auth');

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_REGEX = /^[0-9+\-()\s]{7,30}$/;

const router = express.Router();

router.get('/api/health', (req, res) => {
  return res.json({ success: true, message: 'Zar Jweller backend is running.' });
});

// Who am I? — session-based
router.get('/api/me', requireApiLogin, (req, res) => {
  return res.json({ success: true, user: req.session.user });
});

// Admin: list users
router.get('/api/users', requireApiLogin, requireApiRole('admin'), async (req, res) => {
  try {
    const users = await listUsers();
    return res.json({ success: true, users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Admin: list contacts
router.get('/api/contacts', requireApiLogin, requireApiRole('admin'), async (req, res) => {
  try {
    const contacts = await listContacts();
    return res.json({ success: true, contacts });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return res.status(500).json({ error: 'Failed to fetch contacts.' });
  }
});

// Public: submit contact form
router.post('/api/contact', async (req, res) => {
  const { name, company, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: 'Please fill all required fields.' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (!PHONE_REGEX.test(phone)) {
    return res.status(400).json({ error: 'Please provide a valid contact number.' });
  }

  try {
    await createContact({
      name: name.trim(),
      company: (company && company.trim()) || null,
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    return res.json({ success: true, message: 'Your message has been received. We will get back to you shortly.' });
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return res.status(500).json({ error: 'Failed to submit contact form.' });
  }
});

// Public: get collections jewellery by collection type
router.get('/api/jewels', async (req, res) => {
  const collectionType = String(req.query.collection_type || req.query.karat || '').toLowerCase();

  if (!collectionType || !['18k', '22k'].includes(collectionType)) {
    return res.status(400).json({ error: 'Invalid or missing collection_type parameter. Use 18k or 22k.' });
  }

  try {
    const jewels = await listJewelsByCollectionType(collectionType);
    const items = jewels.map((j) => ({
      id: j.id,
      collection_type: j.collection_type,
      category: j.category,
      collection_url: j.collection_url,
      image: j.image ? `/uploads/jewellery/${j.image}` : null,
      created_at: j.created_at,
      updated_at: j.updated_at,
    }));
    return res.json({ success: true, collection_type: collectionType, items });
  } catch (error) {
    console.error('Failed to fetch jewels:', error);
    return res.status(500).json({ error: 'Failed to fetch jewellery.' });
  }
});

function serializeProduct(item) {
  return {
    id: item.id,
    category_id: item.category_id,
    category_name: item.category_name,
    subcategory_id: item.subcategory_id,
    subcategory_name: item.subcategory_name,
    title: item.title,
    collection_name: item.collection_name,
    short_description: item.short_description,
    number_of_pcs: item.number_of_pcs,
    display_finish: item.display_finish,
    weight_specifications: item.weight_specifications || [],
    technical_specifications: item.technical_specifications || [],
    manufacturing_support: item.manufacturing_support,
    product_url: item.product_url,
    product_images: (item.product_images || []).map((name) => `/uploads/products/${name}`),
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

router.get('/api/product-categories', async (_req, res) => {
  try {
    const collectionType = String(_req.query.collection_type || '').toLowerCase();
    const categories = await listJewelsForCategorySelection();
    const filteredCategories = collectionType && ['18k', '22k'].includes(collectionType)
      ? categories.filter((category) => String(category.collection_type || '').toLowerCase() === collectionType)
      : categories;
    return res.json({ success: true, categories: filteredCategories });
  } catch (error) {
    console.error('Failed to fetch product categories:', error);
    return res.status(500).json({ error: 'Failed to fetch product categories.' });
  }
});

router.get('/api/subcategories', async (req, res) => {
  const collectionType = String(req.query.collection_type || req.query.karat || '').toLowerCase();
  const categoryId = Number.parseInt(String(req.query.category_id || '').trim(), 10);

  if (!collectionType || !['18k', '22k'].includes(collectionType)) {
    return res.status(400).json({ error: 'Invalid or missing collection_type parameter. Use 18k or 22k.' });
  }

  if (Number.isNaN(categoryId) || categoryId <= 0) {
    return res.status(400).json({ error: 'Invalid or missing category_id parameter.' });
  }

  try {
    const subcategories = await listSubcategoriesByCollectionAndCategory({
      collectionType,
      categoryId,
    });
    const items = subcategories.map((row) => ({
      id: row.id,
      category_id: row.category_id,
      category_name: row.category_name,
      collection_type: row.collection_type,
      category: row.category,
      subcategory_url: row.subcategory_url,
      image: row.image ? `/uploads/jewellery/${row.image}` : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return res.json({ success: true, collection_type: collectionType, category_id: categoryId, items });
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
    return res.status(500).json({ error: 'Failed to fetch subcategories.' });
  }
});

router.get('/api/product-subcategories', async (req, res) => {
  const categoryId = Number.parseInt(String(req.query.category_id || '').trim(), 10);

  if (Number.isNaN(categoryId) || categoryId <= 0) {
    return res.status(400).json({ error: 'Invalid or missing category_id parameter.' });
  }

  try {
    const subcategories = await listSubcategoriesForSelectionByCategoryId(categoryId);
    return res.json({ success: true, category_id: categoryId, subcategories });
  } catch (error) {
    console.error('Failed to fetch product subcategories:', error);
    return res.status(500).json({ error: 'Failed to fetch product subcategories.' });
  }
});

router.get('/api/products', async (req, res) => {
  const categoryName = String(req.query.category || '').trim();
  const categoryId = Number.parseInt(String(req.query.category_id || '').trim(), 10);
  const subcategoryId = Number.parseInt(String(req.query.subcategory_id || '').trim(), 10);

  try {
    let items;

    if (!Number.isNaN(categoryId) && categoryId > 0 && !Number.isNaN(subcategoryId) && subcategoryId > 0) {
      items = await listProductsByCategoryAndSubcategory({
        categoryId,
        subcategoryId,
      });
    } else if (categoryName) {
      items = await listProductsByCategory(categoryName);
    } else {
      items = await listProducts();
    }

    return res.json({
      success: true,
      category: categoryName || null,
      category_id: !Number.isNaN(categoryId) && categoryId > 0 ? categoryId : null,
      subcategory_id: !Number.isNaN(subcategoryId) && subcategoryId > 0 ? subcategoryId : null,
      items: items.map(serializeProduct),
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

router.get('/api/products/:id', async (req, res) => {
  try {
    const product = await findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json({ success: true, product: serializeProduct(product) });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

module.exports = router;


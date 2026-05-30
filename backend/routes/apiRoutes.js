const express = require('express');
const rateLimit = require('express-rate-limit');
const zarJourneyController = require('../controllers/admin/zarJourneyController');
const buildConnectionController = require('../controllers/admin/buildConnectionController');
const contactInquiryController = require('../controllers/admin/contactInquiryController');
const careerApplicationController = require('../controllers/admin/careerApplicationController');
const { cvUpload, handleMulterError } = require('../middleware/upload');
const uploadCv = cvUpload('cvs', { files: 1, fallbackName: 'applicant-cv' });
const { listUsers } = require('../models/userModel');
const { listContacts, createContact } = require('../models/contactModel');

const {
  listJewelsByCollectionType,
  listDistinctJewelCategories,
  listJewelsForCategorySelection
} = require('../models/jewelModel');

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

const {
  listEvents,
  findEventById,
} = require('../models/eventModel');

const {
  requireApiLogin,
  requireApiRole
} = require('../middleware/auth');

const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const PHONE_REGEX =
  /^[0-9+\-()\s]{7,30}$/;

const router = express.Router();

/* =========================================================
   HEALTH API
========================================================= */

router.get('/api/health', (req, res) => {

  return res.json({
    success: true,
    message: 'Zar jewels backend is running.'
  });
});

/* =========================================================
   SESSION USER API
========================================================= */

router.get('/api/me', requireApiLogin, (req, res) => {

  return res.json({
    success: true,
    user: req.session.user
  });
});

/* =========================================================
   USERS API
========================================================= */

router.get(
  '/api/users',
  requireApiLogin,
  requireApiRole('admin'),

  async (req, res) => {

    try {

      const users = await listUsers();

      return res.json({
        success: true,
        users
      });

    } catch (error) {

      console.error('Failed to fetch users:', error);

      return res.status(500).json({
        error: 'Failed to fetch users.'
      });
    }
  }
);

/* =========================================================
   CONTACTS API
========================================================= */

router.get(
  '/api/contacts',
  requireApiLogin,
  requireApiRole('admin'),

  async (req, res) => {

    try {

      const contacts = await listContacts();

      return res.json({
        success: true,
        contacts
      });

    } catch (error) {

      console.error('Failed to fetch contacts:', error);

      return res.status(500).json({
        error: 'Failed to fetch contacts.'
      });
    }
  }
);

/* =========================================================
   CONTACT FORM API
========================================================= */

router.post('/api/contact', async (req, res) => {

  const {
    name,
    company,
    email,
    phone,
    subject,
    message
  } = req.body;

  if (!name || !email || !phone || !subject || !message) {

    return res.status(400).json({
      error: 'Please fill all required fields.'
    });
  }

  if (!EMAIL_REGEX.test(email)) {

    return res.status(400).json({
      error: 'Please provide a valid email address.'
    });
  }

  if (!PHONE_REGEX.test(phone)) {

    return res.status(400).json({
      error: 'Please provide a valid contact number.'
    });
  }

  try {

    await createContact({
      name: name.trim(),
      company: company ? company.trim() : null,
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.json({
      success: true,
      message: 'Your message has been received.'
    });

  } catch (error) {

    console.error('Failed to submit contact form:', error);

    return res.status(500).json({
      error: 'Failed to submit contact form.'
    });
  }
});

/* =========================================================
   JEWELS API
========================================================= */

router.get('/api/jewels', async (req, res) => {

  const collectionType = String(
    req.query.collection_type ||
    req.query.karat ||
    ''
  ).toLowerCase();

  if (
    !collectionType ||
    !['18k', '22k'].includes(collectionType)
  ) {

    return res.status(400).json({
      error:
        'Invalid or missing collection_type parameter. Use 18k or 22k.'
    });
  }

  try {

    const jewels =
      await listJewelsByCollectionType(collectionType);

    const items = jewels.map((jewel) => ({
      id: jewel.id,
      collection_type: jewel.collection_type,
      category: jewel.category,
      collection_url: jewel.collection_url,
      image: jewel.image
        ? `/uploads/jewellery/${jewel.image}`
        : null,
      created_at: jewel.created_at,
      updated_at: jewel.updated_at,
    }));

    return res.json({
      success: true,
      collection_type: collectionType,
      items
    });

  } catch (error) {

    console.error('Failed to fetch jewels:', error);

    return res.status(500).json({
      error: 'Failed to fetch jewellery.'
    });
  }
});

/* =========================================================
   PRODUCT SERIALIZER
========================================================= */

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
    weight_specifications:
      item.weight_specifications || [],
    technical_specifications:
      item.technical_specifications || [],
    manufacturing_support:
      item.manufacturing_support,
    product_url: item.product_url,
    product_images: (item.product_images || []).map(
      (name) => `/uploads/products/${name}`
    ),
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

/* =========================================================
   EVENT SERIALIZER
========================================================= */

function serializeEvent(item) {

  return {
    id: item.id,
    title: item.title,
    location: item.location,
    start_date: item.start_date,
    end_date: item.end_date,
    description: item.description,
    event_url: item.event_url,
    status: item.status,
    event_images: (item.event_image || []).map(
      (name) => `/uploads/events/${name}`
    ),
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

/* =========================================================
   PRODUCT CATEGORY API
========================================================= */

router.get('/api/product-categories', async (req, res) => {

  try {

    const collectionType = String(
      req.query.collection_type || ''
    ).toLowerCase();

    const categories =
      await listJewelsForCategorySelection();

    const filteredCategories =
      collectionType &&
      ['18k', '22k'].includes(collectionType)
        ? categories.filter(
            (category) =>
              String(category.collection_type)
                .toLowerCase() === collectionType
          )
        : categories;

    return res.json({
      success: true,
      categories: filteredCategories
    });

  } catch (error) {

    console.error(
      'Failed to fetch product categories:',
      error
    );

    return res.status(500).json({
      error: 'Failed to fetch product categories.'
    });
  }
});

/* =========================================================
   SUBCATEGORY API
========================================================= */

router.get('/api/subcategories', async (req, res) => {

  const collectionType = String(
    req.query.collection_type ||
    req.query.karat ||
    ''
  ).toLowerCase();

  const categoryId = Number.parseInt(
    String(req.query.category_id || '').trim(),
    10
  );

  if (
    !collectionType ||
    !['18k', '22k'].includes(collectionType)
  ) {

    return res.status(400).json({
      error:
        'Invalid or missing collection_type parameter.'
    });
  }

  if (Number.isNaN(categoryId) || categoryId <= 0) {

    return res.status(400).json({
      error: 'Invalid or missing category_id parameter.'
    });
  }

  try {

    const subcategories =
      await listSubcategoriesByCollectionAndCategory({
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
      image: row.image
        ? `/uploads/jewellery/${row.image}`
        : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return res.json({
      success: true,
      collection_type: collectionType,
      category_id: categoryId,
      items
    });

  } catch (error) {

    console.error(
      'Failed to fetch subcategories:',
      error
    );

    return res.status(500).json({
      error: 'Failed to fetch subcategories.'
    });
  }
});

/* =========================================================
   PRODUCT SUBCATEGORY API
========================================================= */

router.get('/api/product-subcategories', async (req, res) => {

  const categoryId = Number.parseInt(
    String(req.query.category_id || '').trim(),
    10
  );

  if (Number.isNaN(categoryId) || categoryId <= 0) {

    return res.status(400).json({
      error: 'Invalid or missing category_id parameter.'
    });
  }

  try {

    const subcategories =
      await listSubcategoriesForSelectionByCategoryId(
        categoryId
      );

    return res.json({
      success: true,
      category_id: categoryId,
      subcategories
    });

  } catch (error) {

    console.error(
      'Failed to fetch product subcategories:',
      error
    );

    return res.status(500).json({
      error: 'Failed to fetch product subcategories.'
    });
  }
});

/* =========================================================
   PRODUCTS API
========================================================= */

router.get('/api/products', async (req, res) => {

  const categoryName =
    String(req.query.category || '').trim();

  const categoryId = Number.parseInt(
    String(req.query.category_id || '').trim(),
    10
  );

  const subcategoryId = Number.parseInt(
    String(req.query.subcategory_id || '').trim(),
    10
  );

  try {

    let items;

    if (
      !Number.isNaN(categoryId) &&
      categoryId > 0 &&
      !Number.isNaN(subcategoryId) &&
      subcategoryId > 0
    ) {

      items =
        await listProductsByCategoryAndSubcategory({
          categoryId,
          subcategoryId,
        });

    } else if (categoryName) {

      items =
        await listProductsByCategory(categoryName);

    } else {

      items = await listProducts();
    }

    return res.json({
      success: true,
      category: categoryName || null,
      category_id:
        !Number.isNaN(categoryId) && categoryId > 0
          ? categoryId
          : null,
      subcategory_id:
        !Number.isNaN(subcategoryId) &&
        subcategoryId > 0
          ? subcategoryId
          : null,
      items: items.map(serializeProduct),
    });

  } catch (error) {

    console.error('Failed to fetch products:', error);

    return res.status(500).json({
      error: 'Failed to fetch products.'
    });
  }
});

/* =========================================================
   PRODUCT DETAIL API
========================================================= */

router.get('/api/products/:id', async (req, res) => {

  try {

    const product =
      await findProductById(req.params.id);

    if (!product) {

      return res.status(404).json({
        error: 'Product not found.'
      });
    }

    return res.json({
      success: true,
      product: serializeProduct(product)
    });

  } catch (error) {

    console.error('Failed to fetch product:', error);

    return res.status(500).json({
      error: 'Failed to fetch product.'
    });
  }
});

/* =========================================================
   EVENTS API
========================================================= */

router.get('/api/events', async (req, res) => {

  try {

    const events = await listEvents();

    return res.json({
      success: true,
      items: events.map(serializeEvent),
    });

  } catch (error) {

    console.error('Failed to fetch events:', error);

    return res.status(500).json({
      error: 'Failed to fetch events.'
    });
  }
});

/* =========================================================
   EVENT DETAIL API
========================================================= */

router.get('/api/events/:id', async (req, res) => {

  try {

    const event =
      await findEventById(req.params.id);

    if (!event) {

      return res.status(404).json({
        error: 'Event not found.'
      });
    }

    return res.json({
      success: true,
      event: serializeEvent(event)
    });

  } catch (error) {

    console.error('Failed to fetch event:', error);

    return res.status(500).json({
      error: 'Failed to fetch event.'
    });
  }
});

// Rate limiters specifically for public forms
const buildConnectionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many submissions from this IP, please try again after 10 minutes.' },
});

const contactInquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many contact inquiries from this IP, please try again after 10 minutes.' },
});

const careerApplicationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many career applications from this IP, please try again after 10 minutes.' },
});

// Zar Journey public route
router.get('/api/public/zar-journey', zarJourneyController.publicList);

// Public form routes with rate limiters
router.post('/api/build-connection', buildConnectionLimiter, buildConnectionController.store);
router.post('/api/contact-inquiry', contactInquiryLimiter, contactInquiryController.store);
router.post('/api/career-application', careerApplicationLimiter, uploadCv.single('cvFile'), careerApplicationController.store);

router.use(handleMulterError);

module.exports = router;
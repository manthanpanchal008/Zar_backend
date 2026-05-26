const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/admin/productController');
const categoryController = require('../controllers/admin/categoryController');
const goldTypeController = require('../controllers/admin/goldTypeController');
const makingTypeController = require('../controllers/admin/makingTypeController');
const userController = require('../controllers/admin/userController');
const eventController = require('../controllers/admin/eventController');
const clienteleController = require('../controllers/admin/clienteleController');
const { requireJwtAuth, requireJwtRole } = require('../middleware/auth');
const { imageUpload, handleMulterError } = require('../middleware/upload');
const { listProducts } = require('../models/productModel');
const { listGoldTypes } = require('../models/goldTypeModel');
const { listCategories } = require('../models/categoryModel');
const { listMakingTypes } = require('../models/makingTypeModel');
const { listUsers } = require('../models/userModel');

const router = express.Router();
const productUpload = imageUpload('products', { files: 10, fallbackName: 'product-image' });
const goldTypeUpload = imageUpload('goldtypes', { files: 1, fallbackName: 'goldtype-image' });
const categoryUpload = imageUpload('categories', { files: 1, fallbackName: 'category-image' });
const makingTypeUpload = imageUpload('makingtypes', { files: 1, fallbackName: 'makingtype-image' });
const eventUpload = imageUpload('events', { files: 10, fallbackName: 'event-image' });
const clienteleUpload = imageUpload('clientele', { files: 1, fallbackName: 'clientele-image' });

router.post('/api/auth/login', authController.login);
router.post('/api/auth/logout', requireJwtAuth, authController.logout);
router.get('/api/auth/me', requireJwtAuth, authController.me);

router.get('/api/admin/dashboard', requireJwtAuth, async (_req, res) => {
  try {
    const [products, goldTypes, categories, makingTypes, users] = await Promise.all([
      listProducts(),
      listGoldTypes(),
      listCategories(),
      listMakingTypes(),
      listUsers(),
    ]);

    return res.json({
      success: true,
      stats: {
        products: products.length,
        goldTypes: goldTypes.length,
        categories: categories.length,
        makingTypes: makingTypes.length,
        users: users.length,
        orders: 0,
      },
    });
  } catch (error) {
    console.error('Failed to load admin dashboard:', error);
    return res.status(500).json({ success: false, error: 'Failed to load dashboard.' });
  }
});

// Dropdown/Option Selectors
router.get('/api/admin/category-options', requireJwtAuth, categoryController.listCategoryOptions);

router.get('/api/admin/gold-type-options', requireJwtAuth, async (_req, res) => {
  try {
    const { listGoldTypesForSelection } = require('../models/goldTypeModel');
    const items = await listGoldTypesForSelection();
    return res.json({ success: true, items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Failed to fetch gold type options.' });
  }
});

router.get('/api/admin/making-type-options', requireJwtAuth, async (_req, res) => {
  try {
    const { listMakingTypesForSelection } = require('../models/makingTypeModel');
    const items = await listMakingTypesForSelection();
    return res.json({ success: true, items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Failed to fetch making type options.' });
  }
});

// SKU Generator endpoint
router.get('/api/admin/products/generate-sku', requireJwtAuth, productController.generateSku);

// Product CRUD routes
router.get('/api/admin/products', requireJwtAuth, productController.index);
router.post('/api/admin/products', requireJwtAuth, requireJwtRole('admin'), productUpload.array('images', 10), productController.store);
router.get('/api/admin/products/:id', requireJwtAuth, productController.show);
router.put('/api/admin/products/:id', requireJwtAuth, requireJwtRole('admin'), productUpload.array('images', 10), productController.update);
router.delete('/api/admin/products/:id', requireJwtAuth, requireJwtRole('admin'), productController.destroy);

// GoldType CRUD routes
router.get('/api/admin/gold-types', requireJwtAuth, goldTypeController.index);
router.get('/api/admin/gold-types/:id', requireJwtAuth, goldTypeController.show);
router.post('/api/admin/gold-types', requireJwtAuth, requireJwtRole('admin'), goldTypeUpload.single('image'), goldTypeController.store);
router.put('/api/admin/gold-types/:id', requireJwtAuth, requireJwtRole('admin'), goldTypeUpload.single('image'), goldTypeController.update);
router.delete('/api/admin/gold-types/:id', requireJwtAuth, requireJwtRole('admin'), goldTypeController.destroy);
router.put('/api/admin/gold-types/:id/toggle', requireJwtAuth, requireJwtRole('admin'), goldTypeController.toggleStatus);

// Category CRUD routes
router.get('/api/admin/categories', requireJwtAuth, categoryController.index);
router.get('/api/admin/categories/:id', requireJwtAuth, categoryController.show);
router.post('/api/admin/categories', requireJwtAuth, requireJwtRole('admin'), categoryUpload.single('image'), categoryController.store);
router.put('/api/admin/categories/:id', requireJwtAuth, requireJwtRole('admin'), categoryUpload.single('image'), categoryController.update);
router.delete('/api/admin/categories/:id', requireJwtAuth, requireJwtRole('admin'), categoryController.destroy);
router.put('/api/admin/categories/:id/toggle', requireJwtAuth, requireJwtRole('admin'), categoryController.toggleStatus);

// MakingType CRUD routes
router.get('/api/admin/making-types', requireJwtAuth, makingTypeController.index);
router.get('/api/admin/making-types/:id', requireJwtAuth, makingTypeController.show);
router.post('/api/admin/making-types', requireJwtAuth, requireJwtRole('admin'), makingTypeUpload.single('image'), makingTypeController.store);
router.put('/api/admin/making-types/:id', requireJwtAuth, requireJwtRole('admin'), makingTypeUpload.single('image'), makingTypeController.update);
router.delete('/api/admin/making-types/:id', requireJwtAuth, requireJwtRole('admin'), makingTypeController.destroy);
router.put('/api/admin/making-types/:id/toggle', requireJwtAuth, requireJwtRole('admin'), makingTypeController.toggleStatus);

// Event CRUD routes
router.get('/api/admin/events', requireJwtAuth, eventController.index);
router.get('/api/admin/events/:id', requireJwtAuth, eventController.show);
router.post('/api/admin/events', requireJwtAuth, requireJwtRole('admin'), eventUpload.array('images', 10), eventController.store);
router.put('/api/admin/events/:id', requireJwtAuth, requireJwtRole('admin'), eventUpload.array('images', 10), eventController.update);
router.delete('/api/admin/events/:id', requireJwtAuth, requireJwtRole('admin'), eventController.destroy);

// Clientele CRUD routes
router.get('/api/admin/clientele', requireJwtAuth, clienteleController.index);
router.get('/api/admin/clientele/:id', requireJwtAuth, clienteleController.show);
router.post('/api/admin/clientele', requireJwtAuth, requireJwtRole('admin'), clienteleUpload.single('clientele_image'), clienteleController.store);
router.put('/api/admin/clientele/:id', requireJwtAuth, requireJwtRole('admin'), clienteleUpload.single('clientele_image'), clienteleController.update);
router.delete('/api/admin/clientele/:id', requireJwtAuth, requireJwtRole('admin'), clienteleController.destroy);

// Users CRUD routes
router.get('/api/admin/users', requireJwtAuth, requireJwtRole('admin'), userController.index);
router.get('/api/admin/users/roles', requireJwtAuth, requireJwtRole('admin'), userController.roles);
router.get('/api/admin/users/:id', requireJwtAuth, requireJwtRole('admin'), userController.show);
router.post('/api/admin/users', requireJwtAuth, requireJwtRole('admin'), userController.store);
router.put('/api/admin/users/:id', requireJwtAuth, requireJwtRole('admin'), userController.update);
router.delete('/api/admin/users/:id', requireJwtAuth, requireJwtRole('admin'), userController.destroy);

router.get('/api/admin/orders', requireJwtAuth, (_req, res) => {
  return res.json({ success: true, items: [] });
});

router.use(handleMulterError);

module.exports = router;

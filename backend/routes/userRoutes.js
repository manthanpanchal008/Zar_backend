const express = require('express');
const { requireLogin, requireWebRole } = require('../middleware/auth');
const userController = require('../controllers/web/userController');

const router = express.Router();

router.get('/users', requireLogin, requireWebRole('admin'), userController.index);

router.get('/users/add', requireLogin, requireWebRole('admin'), userController.add);
router.post('/users/add', requireLogin, requireWebRole('admin'), userController.store);

router.get('/users/edit/:id', requireLogin, requireWebRole('admin'), userController.edit);
router.post('/users/edit/:id', requireLogin, requireWebRole('admin'), userController.update);

router.post('/users/delete/:id', requireLogin, requireWebRole('admin'), userController.destroy);

module.exports = router;
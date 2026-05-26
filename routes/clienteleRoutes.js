const express = require('express');
const { requireLogin, requireWebRole } = require('../middleware/auth');
const clienteleController = require('../controllers/web/clienteleController');

const router = express.Router();

router.get('/clientele', requireLogin, clienteleController.index);

router.get('/clientele/add', requireLogin, requireWebRole('admin'), clienteleController.add);
router.post('/clientele/add', requireLogin, requireWebRole('admin'), clienteleController.store);

router.get('/clientele/edit/:id', requireLogin, requireWebRole('admin'), clienteleController.edit);
router.post('/clientele/edit/:id', requireLogin, requireWebRole('admin'), clienteleController.update);

router.post('/clientele/delete/:id', requireLogin, requireWebRole('admin'), clienteleController.destroy);

module.exports = router;
const express = require('express');
const { requireLogin } = require('../middleware/auth');
const dashboardController = require('../controllers/web/dashboardController');

const router = express.Router();

router.get('/', dashboardController.index);
router.get('/dashboard', requireLogin, dashboardController.dashboard);

module.exports = router;

const express = require('express');
const authController = require('../controllers/web/authController');

const router = express.Router();

router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.post('/api/auth/login', authController.apiLogin);
router.get('/logout', authController.logout);

module.exports = router;

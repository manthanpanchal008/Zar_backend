const express = require('express');
const bcrypt = require('bcrypt');
const { findUserByEmail } = require('../models/userModel');
const { getSafeUserFromDbRow } = require('../middleware/auth');

const router = express.Router();

function normalizeBcryptHash(hash) {
  if (typeof hash === 'string' && hash.startsWith('$2y$')) {
    return '$2b$' + hash.slice(4);
  }
  return hash;
}

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  return res.render('login', { message: null });
});

// Web form login — session only
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { message: 'Email and password are required.' });
  }

  try {
    const user = await findUserByEmail(email.trim().toLowerCase());
    if (!user) return res.render('login', { message: 'Invalid credentials.' });

    const normalizedHash = normalizeBcryptHash(user.password);
    const valid = await bcrypt.compare(password, normalizedHash);
    if (!valid) return res.render('login', { message: 'Invalid credentials.' });

    req.session.user = getSafeUserFromDbRow(user);
    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    return res.render('login', { message: 'Login failed. Please try again.' });
  }
});

router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await findUserByEmail(email.trim().toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const normalizedHash = normalizeBcryptHash(user.password);
    const valid = await bcrypt.compare(password, normalizedHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

    req.session.user = getSafeUserFromDbRow(user);
    return res.json({ success: true, message: 'Login successful.', user: req.session.user });
  } catch (err) {
    console.error('API login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
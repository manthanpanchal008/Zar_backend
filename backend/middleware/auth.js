const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { listUserRoles } = require('../models/metaModel');
const { findUserById } = require('../models/userModel');

function sanitizeRole(role) {
  if (!role || typeof role !== 'string') return '';
  return role.trim().toLowerCase();
}

function getSafeUserFromDbRow(dbUser) {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: sanitizeRole(dbUser.role),
  };
}

function signAdminToken(user) {
  return jwt.sign(getSafeUserFromDbRow(user), JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme && scheme.toLowerCase() === 'bearer' && token) return token;
  if (req.headers.cookie) {
    const cookies = Object.fromEntries(
      req.headers.cookie.split(';').map((part) => {
        const [key, ...value] = part.trim().split('=');
        return [key, decodeURIComponent(value.join('='))];
      })
    );
    if (cookies.admin_token) return cookies.admin_token;
  }
  return null;
}

async function requireJwtAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const dbUser = await findUserById(decoded.id);
    if (!dbUser) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }

    req.user = getSafeUserFromDbRow(dbUser);
    return next();
  } catch (_error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
}

function requireJwtRole(...allowedRoles) {
  const normalized = allowedRoles.map(sanitizeRole);
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    const dbRoles = await listUserRoles();
    const activeRole = sanitizeRole(req.user.role);
    const permittedRoles = normalized.filter((role) => dbRoles.includes(role));

    if (!permittedRoles.includes(activeRole)) {
      return res.status(403).json({ success: false, error: 'Forbidden: insufficient role permissions.' });
    }
    return next();
  };
}

// Web routes: redirect to /login if not logged in
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// Web routes: require specific role(s), render 403 page on failure
function requireWebRole(...allowedRoles) {
  const normalized = allowedRoles.map(sanitizeRole);
  return async (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');

    const dbRoles = await listUserRoles();
    const activeRole = sanitizeRole(req.session.user.role);
    const permittedRoles = normalized.filter((role) => dbRoles.includes(role));

    if (!permittedRoles.includes(activeRole)) {
      req.session.flash = {
        type: 'error',
        message: 'You do not have permission to access this section.',
      };
      return res.redirect('/dashboard');
    }
    next();
  };
}

// API routes: return 401 JSON if not logged in via session
function requireApiLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}

// API routes: return 403 JSON if role insufficient
function requireApiRole(...allowedRoles) {
  const normalized = allowedRoles.map(sanitizeRole);
  return async (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const dbRoles = await listUserRoles();
    const activeRole = sanitizeRole(req.session.user.role);
    const permittedRoles = normalized.filter((role) => dbRoles.includes(role));

    if (!permittedRoles.includes(activeRole)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role permissions.' });
    }
    next();
  };
}

module.exports = {
  sanitizeRole,
  getSafeUserFromDbRow,
  signAdminToken,
  requireJwtAuth,
  requireJwtRole,
  requireLogin,
  requireWebRole,
  requireApiLogin,
  requireApiRole,
};

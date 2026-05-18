const { listUserRoles } = require('../models/metaModel');

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
  requireLogin,
  requireWebRole,
  requireApiLogin,
  requireApiRole,
};


const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { PORT, SESSION_SECRET, CORS_ORIGIN } = require('./config/env');
const { ensureSchema } = require('./config/bootstrap');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const clienteleRoutes = require('./routes/clienteleRoutes');
const collectionsjewelleryRoutes = require('./routes/collectionsjewelleryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const { countEvents } = require('./models/eventModel');

const app = express();

function sanitizeApiPayload(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeApiPayload);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => {
      if (key.toLowerCase().includes('password')) {
        return [key, '[REDACTED]'];
      }

      return [key, sanitizeApiPayload(nestedValue)];
    })
  );
}

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/api', (req, res, next) => {
  const startedAt = Date.now();
  const originalJson = res.json.bind(res);

  console.log('[API REQUEST]', {
    method: req.method,
    path: req.originalUrl,
    params: sanitizeApiPayload(req.params),
    query: sanitizeApiPayload(req.query),
    body: sanitizeApiPayload(req.body),
  });

  res.json = (payload) => {
    console.log('[API RESPONSE]', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      data: sanitizeApiPayload(payload),
    });

    return originalJson(payload);
  };

  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  const flash = req.session.flash || null;
  req.session.flash = null;

  res.locals.flashMessage = flash && flash.type !== 'error' ? flash.message : null;
  res.locals.flashError = flash && flash.type === 'error' ? flash.message : null;
  res.locals.eventCount = 0;

  if (!req.session.user) {
    return next();
  }

  try {
    res.locals.eventCount = await countEvents();
  } catch (error) {
    console.error('Failed to load event count:', error);
  }

  return next();
});

app.use(authRoutes);
app.use(apiRoutes);
app.use(dashboardRoutes);
app.use(userRoutes);
app.use(eventRoutes);
app.use(clienteleRoutes);
app.use(collectionsjewelleryRoutes);
app.use(subcategoryRoutes);
app.use(productRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

async function start() {
  try {
    await ensureSchema();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // Graceful handling for EADDRINUSE
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\nPort ${PORT} is already in use.\nPlease close the other process using this port or change the PORT in config/env.js.\n`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.error('Failed to initialize database schema:', error.message || error);
    process.exit(1);
  }
}

start();

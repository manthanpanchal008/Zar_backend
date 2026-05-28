const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { SESSION_SECRET, CORS_ORIGIN } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const adminApiRoutes = require('./routes/adminApiRoutes');
const apiRoutes = require('./routes/apiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const clienteleRoutes = require('./routes/clienteleRoutes');
const productRoutes = require('./routes/productRoutes');
const { countEvents } = require('./models/eventModel');

const app = express();
app.set('trust proxy', 1);
// Hardened Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "*"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "*"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "*"],
        frameSrc: ["'self'", "*"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Gzip Compression
app.use(compression());

// Logger
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api/', apiLimiter);

function sanitizeApiPayload(value) {
  if (Array.isArray(value)) return value.map(sanitizeApiPayload);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      key.toLowerCase().includes('password') ? '[REDACTED]' : sanitizeApiPayload(nestedValue),
    ])
  );
}

const allowedOrigins = typeof CORS_ORIGIN === 'string'
  ? CORS_ORIGIN.split(',').map(origin => origin.trim())
  : CORS_ORIGIN;

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or tools like Postman/curl (no origin)
    if (!origin) return callback(null, true);

    // Allow explicitly whitelisted origins
    if (
      (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) ||
      allowedOrigins === origin ||
      allowedOrigins === '*'
    ) {
      return callback(null, true);
    }

    // Automatically allow any local development server (localhost / 127.0.0.1 on any port)
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
}));

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

  if (!req.session.user) return next();

  try {
    res.locals.eventCount = await countEvents();
  } catch (error) {
    console.error('Failed to load event count:', error);
  }

  return next();
});

app.use(adminApiRoutes);
app.use(authRoutes);
app.use(apiRoutes);
app.use(dashboardRoutes);
app.use(userRoutes);
app.use(eventRoutes);
app.use(clienteleRoutes);
app.use(productRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// Centralized Error Handler
app.use((err, req, res, _next) => {
  console.error('[SERVER ERROR]', err);

  const statusCode = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: isProd ? 'Internal Server Error' : err.message || 'An unexpected error occurred.',
    ...(isProd ? {} : { stack: err.stack }),
  });
});

module.exports = app;

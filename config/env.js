require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'zar_jeweller',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  JWT_SECRET: process.env.JWT_SECRET || process.env.SESSION_SECRET || 'your-jwt-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

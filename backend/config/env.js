require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const requiredEnv = ['JWT_SECRET', 'SESSION_SECRET', 'DB_HOST', 'DB_NAME', 'DB_USER'];
  for (const key of requiredEnv) {
    const value = process.env[key];
    if (!value || value.includes('change-in-production') || value.includes('change-me')) {
      throw new Error(`CRITICAL: Environment variable ${key} is required and must not be a default/insecure placeholder in production.`);
    }
  }
}

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

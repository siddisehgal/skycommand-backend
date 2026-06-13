require('dotenv').config();

function validateEnv() {
  const required = [];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (!process.env.PORT) {
    process.env.PORT = '5000';
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  if (!process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL = 'http://localhost:3000';
  }

  if (!process.env.OPENSKY_API_URL) {
    process.env.OPENSKY_API_URL = 'https://opensky-network.org/api';
  }
}

module.exports = { 
  validateEnv,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  OPENSKY_CLIENT_ID: process.env.OPENSKY_CLIENT_ID || '',
  OPENSKY_CLIENT_SECRET: process.env.OPENSKY_CLIENT_SECRET || '',
  OPENSKY_API_URL: process.env.OPENSKY_API_URL || 'https://opensky-network.org/api',
  DB_URL: process.env.DB_URL || null,
};

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'hostel_management',
  }
};

/**
 * server.js — Entry Point
 *
 * This file:
 * 1. Loads environment variables from .env
 * 2. Connects to MongoDB
 * 3. Starts the Express HTTP server
 *
 * We keep server.js minimal and put all Express configuration in app.js
 */

const dotenv = require('dotenv');

// Load .env FIRST, before anything else imports process.env
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🍽️  College Canteen API running on port ${PORT}`);
      console.log(`📦  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌍  Client URL:  ${process.env.CLIENT_URL}`);
      console.log('='.repeat(50));
    });
  })
  .catch((err) => {
    console.error('❌  Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit so nodemon/PM2 can restart cleanly
  });

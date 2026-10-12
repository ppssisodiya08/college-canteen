/**
 * config/db.js — MongoDB Connection
 *
 * This module handles the Mongoose connection to MongoDB.
 * It's called once from server.js before the HTTP server starts.
 *
 * Why async/await?  connectDB() returns a Promise so server.js can
 * wait for the DB to connect before accepting HTTP requests.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options suppress deprecation warnings in Mongoose 7/8
      // (They are the default in newer Mongoose, but it's good practice to include them)
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
    console.log(`📚  Database: ${conn.connection.name}`);

    // ── Mongoose event listeners ──────────────────────────────────────────
    mongoose.connection.on('error', (err) => {
      console.error('❌  MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️   MongoDB disconnected');
    });

    // Graceful shutdown: close MongoDB connection when Node process exits
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑  MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌  MongoDB connection failed:', error.message);
    throw error; // Let server.js handle the exit
  }
};

module.exports = connectDB;

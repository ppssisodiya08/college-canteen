/**
 * app.js — Express Application Configuration
 *
 * This file sets up all Express middleware and mounts all route files.
 * server.js imports this and starts the HTTP server.
 *
 * Separation of concerns: app.js = what the app does, server.js = how it runs.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import route files (we'll create these in Phase 2 & 3)
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// ─── Security & CORS ─────────────────────────────────────────────────────────
// CORS tells browsers which origins are allowed to make requests to our server.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Required to allow cookies (httpOnly JWT cookies)
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));     // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser());                       // Parse cookies (for JWT)

// ─── Sanitization ─────────────────────────────────────────────────────────────
// Removes any MongoDB operators ($, .) from user-supplied input to prevent
// NoSQL injection attacks
app.use(mongoSanitize());

// ─── Logging ──────────────────────────────────────────────────────────────────
// 'dev' format: colored short output useful during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Static Files ─────────────────────────────────────────────────────────────
// Serve uploaded food images from the /uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health Check ─────────────────────────────────────────────────────────────
// A simple GET /api/health endpoint so we can verify the server is running
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'College Canteen API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
// Must come AFTER all routes
app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must come LAST — handles errors passed via next(err)
app.use(errorHandler);

module.exports = app;

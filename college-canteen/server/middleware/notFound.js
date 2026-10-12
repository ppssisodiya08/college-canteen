/**
 * middleware/notFound.js — 404 Handler
 *
 * Catches any request that didn't match a defined route
 * and returns a clean 404 JSON response.
 *
 * This must be mounted AFTER all routes in app.js.
 */

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;

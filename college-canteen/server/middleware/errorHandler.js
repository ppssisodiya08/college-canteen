/**
 * middleware/errorHandler.js — Global Error Handler
 *
 * Express uses a 4-argument middleware as the global error handler.
 * Any route can call next(err) to forward errors here.
 *
 * This gives us one central place to:
 *  - Format consistent error responses
 *  - Handle specific error types (Mongoose, JWT, etc.)
 *  - Log errors
 *  - Never leak stack traces to production clients
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null; // Field-level validation errors

  // ── Handle specific error types ───────────────────────────────────────────

  // Mongoose: invalid ObjectId (e.g., /api/foods/not-a-valid-id)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = `Resource not found`;
  }

  // Mongoose: duplicate key error (e.g., registering with existing email)
  if (err.code === 11000) {
    statusCode = 409; // 409 Conflict
    const field = Object.keys(err.keyValue)[0];
    message = `An account with this ${field} already exists`;
  }

  // Mongoose: schema validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // JWT: token malformed or invalid
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  }

  // JWT: token expired
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  // Multer: file too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size too large. Maximum allowed size is 5MB.';
  }

  // ── Build the response ────────────────────────────────────────────────────
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Only include stack trace in development (never in production!)
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;

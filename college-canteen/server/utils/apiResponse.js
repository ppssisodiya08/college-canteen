/**
 * utils/apiResponse.js — Standardized API Response Helpers
 *
 * All API responses follow this consistent format:
 *
 * Success:
 *   { success: true, message: "...", data: {...}, meta: {...} }
 *
 * Error (handled by errorHandler.js):
 *   { success: false, message: "...", errors: [...] }
 *
 * Using helper functions ensures every controller produces the same shape,
 * making the frontend code simpler and more predictable.
 */

/**
 * Send a successful response
 * @param {object} res   - Express response object
 * @param {number} statusCode - HTTP status code (default 200)
 * @param {string} message    - Human-readable success message
 * @param {*}      data       - The payload to return (object or array)
 * @param {object} meta       - Optional metadata (pagination, totals, etc.)
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Create an AppError with a status code attached.
 * Pass this to next() in a controller to trigger errorHandler.js.
 *
 * Usage in a controller:
 *   return next(createError('Food not found', 404));
 */
const createError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { sendSuccess, createError };

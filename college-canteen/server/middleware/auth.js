/**
 * middleware/auth.js — Authentication & Authorization Middleware
 *
 * Two middleware functions are exported:
 *
 * 1. protect(req, res, next)
 *    - Verifies the JWT from the httpOnly cookie
 *    - Attaches the user object to req.user
 *    - Blocks unauthenticated requests with 401
 *
 * 2. restrictTo(...roles)
 *    - A factory function that returns middleware
 *    - Checks if the logged-in user's role is in the allowed list
 *    - Blocks unauthorized roles with 403
 *
 * JWT Strategy: We use httpOnly cookies (not localStorage).
 *   + Pros: Cookies are not accessible via JavaScript, protecting against XSS
 *   - Cons: Requires CSRF protection for state-changing requests
 *   We mitigate CSRF by checking the Origin/Referer header and by
 *   requiring CORS credentials — standard practice for same-origin SPAs.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: create an AppError ────────────────────────────────────────────────
// We create a small helper instead of importing a whole error class
const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ── protect ───────────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    // 1. Read JWT from the httpOnly cookie named 'token'
    const token = req.cookies?.token;

    if (!token) {
      return next(createError('You are not logged in. Please log in to continue.', 401));
    }

    // 2. Verify the token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check the user still exists in the database
    //    (handles case where admin deletes a user who still has a valid token)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(createError('User no longer exists.', 401));
    }

    // 4. Attach user to the request so downstream handlers can use it
    req.user = user;
    next();
  } catch (error) {
    next(error); // Forward JWT errors to errorHandler.js
  }
};

// ── restrictTo ────────────────────────────────────────────────────────────────
// Usage:  router.get('/admin-only', protect, restrictTo('admin'), handler)
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

module.exports = { protect, restrictTo };

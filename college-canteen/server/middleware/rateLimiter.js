/**
 * middleware/rateLimiter.js — Rate Limiting
 *
 * Limits the number of requests per IP address in a time window.
 * This protects against:
 *   - Brute-force password attacks on /api/auth/login
 *   - Automated spam registrations on /api/auth/register
 *
 * We export two limiters with different thresholds:
 *   authLimiter  → strict limit for login/register
 *   generalLimiter → loose limit for everything else
 */

const rateLimit = require('express-rate-limit');

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 20,                   // Max 20 requests per 15 min per IP
  message: {
    success: false,
    message: 'Too many attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,     // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
});

// Looser limiter for general API usage
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                  // 300 requests per 15 min per IP
  message: {
    success: false,
    message: 'Too many requests from this IP. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, generalLimiter };

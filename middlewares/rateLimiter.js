const { rateLimit } = require('express-rate-limit');

// Strict limiter for authentication endpoints (prevents brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Max 10 attempts per IP per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many login/register attempts. Please try again after 15 minutes.',
  },
});

// General limiter for public API traffic
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100, // Max 100 requests per IP per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP. Please try again later.',
  },
});

module.exports = { authLimiter, globalLimiter };
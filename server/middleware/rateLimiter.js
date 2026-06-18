const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Too many login attempts, please try again later.' },
    skipSuccessfulRequests: true,
});

const voteLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1,
    message: { success: false, message: 'You can only vote once.' },
});

module.exports = { limiter, authLimiter, voteLimiter };
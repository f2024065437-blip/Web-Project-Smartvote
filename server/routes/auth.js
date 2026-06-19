const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, forgotPassword, resetPassword, logout, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegistration, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegistration, register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', validateLogin, login);  // ← Removed authLimiter  // ← This must exist
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

module.exports = router;
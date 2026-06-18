const express = require('express');
const router = express.Router();
const { 
    register, 
    verifyEmail, 
    login, 
    forgotPassword, 
    resetPassword, 
    logout, 
    getMe,
    createAdminIfMissing 
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegistration, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegistration, register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', validateLogin, authLimiter, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

// TEMPORARY ROUTE - Remove after admin is created
router.post('/create-admin', createAdminIfMissing);

module.exports = router;
const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// #3 — Strict brute-force rate limiter for auth endpoints (5 attempts / 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slightly looser limiter for forgot-password (10 / 15 min) to avoid frustrating users
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many password reset requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);              // #21 — profile update
router.put('/change-password', protect, changePassword); // #21 — change password
router.delete('/me', protect, deleteMe);           // #14 — account deletion (GDPR)

router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;

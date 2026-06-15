const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (id) => {
  // In a real app, use a strong secret from .env. For now we use a fallback.
  const secret = process.env.JWT_SECRET || 'jobmatcher_super_secret_key_2026';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// Set token in HTTP-only cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  user.password = undefined; // Remove password from output

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token, // Send token in body for localStorage fallback
    user,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    // Normalize email
    email = email.trim().toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email is already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Normalize email to avoid case-sensitivity or trailing space issues
    email = email.trim().toLowerCase();

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide an email address' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Security: Never return whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email is registered, a password reset link has been sent.',
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token and expiry time (15 minutes)
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Generate reset link using application's configured frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const cleanFrontendUrl = frontendUrl.replace(/\/$/, '');
    const resetLink = `${cleanFrontendUrl}/reset-password/${token}`;

    console.log('🔑 Password Reset Link:', resetLink);

    // Send password reset email using Resend
    await sendPasswordResetEmail(normalizedEmail, resetLink);

    res.status(200).json({
      success: true,
      message: 'If that email is registered, a password reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// NOTE: This route is PUBLIC — no auth middleware is used.
exports.resetPassword = async (req, res, next) => {
  try {
    console.log('🔑 Reset password request received');
    const { token } = req.params;
    console.log('   Token:', token ? `${token.slice(0, 10)}...` : 'MISSING');
    const { password, confirmPassword } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, error: 'Please provide a password' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    // Verify token and expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired password reset token' });
    }

    // Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password, clear token and expiry to prevent token reuse
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (err) {
    next(err);
  }
};

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('FATAL: JWT_SECRET is not defined in environment variables.');
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// Send token in both httpOnly cookie and response body (mobile browsers block cross-site cookies)
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  user.password = undefined; // Remove password from output

  // Token is sent in BOTH the httpOnly cookie (desktop) AND the response body.
  // Mobile browsers (iOS Safari, Android Chrome) often block cross-site cookies
  // with SameSite=None due to ITP/privacy policies. Sending the token in the
  // response body lets the frontend store it in localStorage and send it via
  // the Authorization header, which works reliably across all browsers.
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    // #8 — Name field validation
    if (!name || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ success: false, error: 'Name must be between 2 and 100 characters.' });
    }
    name = name.trim();

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password.' });
    }

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

// @desc    Update current user's profile (name)
// @route   PUT /api/auth/me
exports.updateMe = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ success: false, error: 'Name must be between 2 and 100 characters.' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Change current user's password
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ success: false, error: 'Please provide all password fields.' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, error: 'New passwords do not match.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete current user's account and all their data
// @route   DELETE /api/auth/me
exports.deleteMe = async (req, res, next) => {
  try {
    const Analysis = require('../models/Analysis');
    await Analysis.deleteMany({ userId: req.user.id });
    await User.findByIdAndDelete(req.user.id);

    // Clear auth cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({ success: true, message: 'Account and all associated data deleted.' });
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

    // Generate secure raw token (sent via email link)
    const rawToken = crypto.randomBytes(32).toString('hex');

    // #4 — Store only the SHA-256 hash in the DB; never the raw token
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetTokenHash = tokenHash;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    // Generate reset link using the raw token (only version the user ever sees)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const cleanFrontendUrl = frontendUrl.replace(/\/$/, '');
    const resetLink = `${cleanFrontendUrl}/reset-password/${rawToken}`;

    if (process.env.NODE_ENV !== 'production') {
      console.log('🔑 Password Reset Link:', resetLink);
    }

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
    const { token } = req.params;
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

    // #4 — Hash the incoming raw token and compare against DB hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetTokenHash: tokenHash,
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
    user.resetTokenHash = undefined;
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

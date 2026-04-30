const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Check cookies for token
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const secret = process.env.JWT_SECRET || 'jobmatcher_super_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    // Attach user to req object
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

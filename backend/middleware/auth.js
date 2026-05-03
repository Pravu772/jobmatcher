const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Logging for debugging mobile issues
  console.log(`📡 Auth check for ${req.path}`);
  console.log('   Headers present:', Object.keys(req.headers).join(', '));
  console.log('   Cookies present:', req.cookies ? Object.keys(req.cookies).join(', ') : 'none');

  // Check Authorization header for token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('   ✅ Token found in Authorization header');
  } 
  // Check cookies for token if not in header
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('   ✅ Token found in cookie');
  }
  
  // Make sure token exists
  if (!token) {
    console.warn(`⚠️ Auth failed for ${req.path}: No token found in headers or cookies`);
    return res.status(401).json({ success: false, error: 'Not authorized: No authentication token found' });
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

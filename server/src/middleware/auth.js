const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ROLE_HIERARCHY = { super_admin: 4, admin: 3, editor: 2, developer: 1 };

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or deactivated.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const requireRole = (minLevel) => (req, res, next) => {
  const userLevel = ROLE_HIERARCHY[req.user?.role] || 0;
  if (userLevel < minLevel) {
    return res.status(403).json({ success: false, message: 'Insufficient permissions.' });
  }
  next();
};

const adminOnly = requireRole(ROLE_HIERARCHY.admin);
const superAdminOnly = requireRole(ROLE_HIERARCHY.super_admin);

module.exports = { protect, adminOnly, superAdminOnly, requireRole, ROLE_HIERARCHY };

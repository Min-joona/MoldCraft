const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Username or email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;
      const identifier = email.toLowerCase().trim();
      const isEmail = identifier.includes('@');
      const user = isEmail
        ? await User.findOne({ email: identifier }).select('+password')
        : await User.findOne({ username: identifier }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      if (!user.isActive) {
        return res.status(401).json({ success: false, message: 'Account is deactivated' });
      }
      const token = generateToken(user._id);
      res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/register (admin only after first user)
router.post(
  '/register',
  protect,
  adminOnly,
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const user = await User.create(req.body);
      res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ success: false, message: 'Email already exists' });
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;

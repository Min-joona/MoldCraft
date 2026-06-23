const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, adminOnly, superAdminOnly } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sanitizeUser = (u) => ({
  id: u._id, name: u.name, username: u.username,
  email: u.email, role: u.role, isActive: u.isActive,
  createdAt: u.createdAt,
});

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
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      if (!user.isActive) {
        return res.status(401).json({ success: false, message: 'Account is deactivated' });
      }
      const token = generateToken(user._id);
      res.json({ success: true, token, user: sanitizeUser(user) });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});

// PATCH /api/auth/password — change own password
router.patch(
  '/password',
  protect,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const user = await User.findById(req.user._id).select('+password');
      if (!(await user.comparePassword(req.body.currentPassword))) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = req.body.newPassword;
      await user.save();
      res.json({ success: true, message: 'Password updated' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PATCH /api/auth/profile — update own profile
router.patch(
  '/profile',
  protect,
  async (req, res) => {
    try {
      const updates = {};
      if (req.body.name) updates.name = req.body.name;
      if (req.body.username) updates.username = req.body.username.toLowerCase().trim();
      if (req.body.email) updates.email = req.body.email.toLowerCase().trim();
      const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
      res.json({ success: true, user: sanitizeUser(user) });
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ success: false, message: 'Username or email already taken' });
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── Super Admin only routes ───

// GET /api/auth/users — list all users
router.get('/users', protect, superAdminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users.map(sanitizeUser) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/users — create user
router.post(
  '/users',
  protect,
  superAdminOnly,
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
      res.status(201).json({ success: true, data: sanitizeUser(user) });
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ success: false, message: 'Email already exists' });
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PATCH /api/auth/users/:id — update user role, status, etc.
router.patch('/users/:id', protect, superAdminOnly, async (req, res) => {
  try {
    const allowed = ['name', 'username', 'email', 'role', 'isActive'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    if (req.body.password) updates.password = req.body.password;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: sanitizeUser(user) });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Username or email already taken' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/auth/users/:id
router.delete('/users/:id', protect, superAdminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

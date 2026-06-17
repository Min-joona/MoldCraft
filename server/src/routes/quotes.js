const express = require('express');
const { body, validationResult } = require('express-validator');
const Quote = require('../models/Quote');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const { sendEmail, quoteConfirmationEmail, adminQuoteNotificationEmail } = require('../utils/email');

const router = express.Router();

// POST /api/quotes — submit a new quote (public)
router.post(
  '/',
  upload.array('referenceImages', 5),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('partDescription').notEmpty().withMessage('Part description is required'),
    body('material').notEmpty().withMessage('Material is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const quoteData = { ...req.body, quantity: Number(req.body.quantity) };

      // Upload images to Cloudinary if any
      if (req.files?.length > 0) {
        quoteData.referenceImages = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer, 'moldcraft/quotes'))
        );
      }

      const quote = await Quote.create(quoteData);

      // Send emails (non-blocking)
      Promise.all([
        sendEmail({ to: quote.email, subject: `Quote Request ${quote.quoteNumber} Received`, html: quoteConfirmationEmail(quote) }),
        sendEmail({ to: process.env.ADMIN_EMAIL, subject: `New Quote Request: ${quote.quoteNumber}`, html: adminQuoteNotificationEmail(quote) }),
      ]).catch(console.error);

      res.status(201).json({ success: true, message: 'Quote submitted successfully', quoteNumber: quote.quoteNumber });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/quotes — list all quotes (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const quotes = await Quote.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Quote.countDocuments(filter);
    res.json({ success: true, data: quotes, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/quotes/:id — single quote (admin)
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('assignedTo', 'name email');
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.json({ success: true, data: quote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/quotes/:id — update quote status (admin)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, quotedPrice, adminNotes, assignedTo } = req.body;
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(quotedPrice && { quotedPrice }), ...(adminNotes && { adminNotes }), ...(assignedTo && { assignedTo }) },
      { new: true, runValidators: true }
    );
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.json({ success: true, data: quote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/quotes/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Quote deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

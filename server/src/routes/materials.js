const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendEmail } = require('../utils/email');

// --- Materials (static data, no DB needed for now) ---
const materialsRouter = express.Router();

const MATERIALS = [
  { id: 'PP', name: 'Polypropylene (PP)', color: '#3B82F6', flexibilty: 'Semi-flexible', heatResistance: 'Medium (100°C)', chemicalResistance: 'Excellent', colorOptions: 'Any', costIndex: 1, typicalUses: 'Caps, containers, living hinges, automotive parts', pros: 'Low cost, food-safe, fatigue resistant', cons: 'UV sensitive, harder to bond' },
  { id: 'ABS', name: 'ABS', color: '#10B981', flexibilty: 'Rigid', heatResistance: 'Medium (80°C)', chemicalResistance: 'Good', colorOptions: 'Any', costIndex: 1.3, typicalUses: 'Enclosures, housings, toys, prototypes', pros: 'Great surface finish, easy to machine/glue', cons: 'Not food-safe, can warp' },
  { id: 'HDPE', name: 'High-Density Polyethylene (HDPE)', color: '#F59E0B', flexibilty: 'Flexible', heatResistance: 'Low-Medium (80°C)', chemicalResistance: 'Excellent', colorOptions: 'Any', costIndex: 0.9, typicalUses: 'Bottles, pipes, cutting boards', pros: 'Food-safe, chemical resistant, recyclable', cons: 'Lower stiffness, hard to paint' },
  { id: 'Nylon', name: 'Nylon (PA6/PA66)', color: '#8B5CF6', flexibilty: 'Semi-flexible', heatResistance: 'High (130°C)', chemicalResistance: 'Good', colorOptions: 'Limited (usually natural/black)', costIndex: 2.1, typicalUses: 'Gears, bearings, structural parts', pros: 'High strength, wear resistant', cons: 'Absorbs moisture, higher cost' },
  { id: 'TPU', name: 'Thermoplastic Polyurethane (TPU)', color: '#EF4444', flexibilty: 'Very flexible', heatResistance: 'Medium (90°C)', chemicalResistance: 'Good', colorOptions: 'Any', costIndex: 2.5, typicalUses: 'Seals, grips, flexible parts', pros: 'Rubber-like feel, abrasion resistant', cons: 'Higher cost, slower cycle time' },
  { id: 'PC', name: 'Polycarbonate (PC)', color: '#06B6D4', flexibilty: 'Rigid', heatResistance: 'High (135°C)', chemicalResistance: 'Fair', colorOptions: 'Any (can be transparent)', costIndex: 2.8, typicalUses: 'Lenses, safety gear, transparent parts', pros: 'Very tough, optically clear', cons: 'Scratches easily, higher cost' },
];

materialsRouter.get('/', (req, res) => res.json({ success: true, data: MATERIALS }));
materialsRouter.get('/:id', (req, res) => {
  const mat = MATERIALS.find((m) => m.id === req.params.id.toUpperCase());
  if (!mat) return res.status(404).json({ success: false, message: 'Material not found' });
  res.json({ success: true, data: mat });
});

// --- Contact ---
const contactRouter = express.Router();

contactRouter.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('message').isLength({ min: 10 }).withMessage('Message too short'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    try {
      const { name, email, phone, subject, message } = req.body;
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Contact Form: ${subject || 'General Inquiry'} from ${name}`,
        html: `<h3>New Contact Message</h3><p><b>From:</b> ${name} (${email})</p>${phone ? `<p><b>Phone:</b> ${phone}</p>` : ''}<p><b>Message:</b></p><p>${message.replace(/\n/g, '<br>')}</p>`,
      });
      res.json({ success: true, message: "Message sent! We'll get back to you soon." });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
    }
  }
);

module.exports = { materialsRouter, contactRouter };

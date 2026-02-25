const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { extractReceiptItems } = require('../utils/ocrService');
const Expense = require('../models/Expense');
const { categorizeItems } = require('../utils/aiService');

// POST /api/expenses/scan
router.post('/scan', protect, async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const items = await extractReceiptItems(base64Data);

    if (items.length === 0) {
      return res.status(422).json({
        message: 'Could not extract items. Try a clearer photo.',
        items: [],
      });
    }

    res.json({ success: true, items });
  } catch (error) {
    console.error('OCR Error:', error.message);
    res.status(500).json({ message: 'OCR failed: ' + error.message });
  }
});

// POST /api/expenses/save
router.post('/save', protect, async (req, res) => {
  try {
    const { items, people, splits, totalAmount } = req.body;

    // AI categorize items before saving
    const categorizedItems = await categorizeItems(items);

    const expense = await Expense.create({
      createdBy: req.user._id,
      items: categorizedItems,
      people,
      splits,
      totalAmount,
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error('Save Error:', error.message);
    res.status(500).json({ message: 'Failed to save expense' });
  }
});

// GET /api/expenses/my
router.get('/my', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
});

module.exports = router;
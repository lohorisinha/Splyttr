const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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
    const { title, items, people, splits, totalAmount } = req.body;

    // AI categorize items before saving
    const categorizedItems = await categorizeItems(items);

    const expense = await Expense.create({
      createdBy: req.user._id,
      title: title || '',
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

// GET /api/expenses/analytics
router.get('/analytics', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ createdBy: req.user._id });

    // 1. Spending by category
    const categoryTotals = {};
    expenses.forEach(expense => {
      expense.items.forEach(item => {
        const cat = item.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + item.price;
      });
    });

    // 2. Monthly spending trend
    const monthlyTotals = {};
    expenses.forEach(expense => {
      const month = new Date(expense.createdAt).toLocaleString('default', {
        month: 'short', year: 'numeric'
      });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.totalAmount;
    });

    // 3. Top split partners
    const peopleTotals = {};
    expenses.forEach(expense => {
      expense.people.forEach(person => {
        if (person !== 'You') {
          peopleTotals[person] = (peopleTotals[person] || 0) + 1;
        }
      });
    });

    // 4. Spending by day of week
    const dayTotals = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    expenses.forEach(expense => {
      const day = days[new Date(expense.createdAt).getDay()];
      dayTotals[day] += expense.totalAmount;
    });

    res.json({
      success: true,
      categoryTotals,
      monthlyTotals,
      peopleTotals,
      dayTotals,
      totalExpenses: expenses.length,
      totalSpent: expenses.reduce((sum, e) => sum + e.totalAmount, 0),
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// POST /api/expenses/insights
router.post('/insights', protect, async (req, res) => {
  try {
    const { analyticsData } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `You are a personal finance assistant. Based on this spending data, give 3-4 short, specific, actionable insights in plain English. Be conversational and helpful.

Data:
- Total splits: ${analyticsData.totalExpenses}
- Total spent: ₹${analyticsData.totalSpent?.toFixed(2)}
- Spending by category: ${JSON.stringify(analyticsData.categoryTotals)}
- Monthly totals: ${JSON.stringify(analyticsData.monthlyTotals)}
- Most split with: ${JSON.stringify(analyticsData.peopleTotals)}
- Spending by day: ${JSON.stringify(analyticsData.dayTotals)}

Give insights about spending patterns. Keep each insight to 1-2 sentences. Use ₹ for currency.`;

    const result = await model.generateContent(prompt);
    const insights = result.response.text();

    res.json({ success: true, insights });

  } catch (error) {
    console.error('Insights error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to generate insights' });
  }
});

// GET /api/expenses/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expense' });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure the expense belongs to the logged in user
    if (expense.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Expense deleted' });

  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
});

module.exports = router;
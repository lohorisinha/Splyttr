const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, default: 'Uncategorized' },
      },
    ],
    people: [{ type: String }],
    splits: [
      {
        person: { type: String },
        amount: { type: Number },
        items: [{ type: String }],
      },
    ],
    totalAmount: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://splyttr-orcin.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // ← limit needed for base64 images!

mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 5000,
  ssl: true,
  tlsAllowInvalidHostnames: false,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses'); // ← ADD THIS

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes); // ← ADD THIS

app.get('/', (req, res) => {
  res.json({ message: 'Splyttr API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
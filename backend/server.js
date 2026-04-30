require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'JobMatcher API is running', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected:', process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

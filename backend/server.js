require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Startup Environment Guard ─────────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is not set in environment variables. Server cannot start.');
  process.exit(1);
}

app.set('trust proxy', 1);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(compression());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  'http://localhost:5173',
  'https://jobmatcherai.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { success: false, error: 'Too many requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 analysis requests per hour
  message: { success: false, error: 'Analysis limit reached. Maximum 10 requests per hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);
app.use('/api/analyze', analysisLimiter);
app.use('/api/match-jd', analysisLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', reportRoutes);

// Health check — used for uptime monitoring (e.g. UptimeRobot) to prevent Render cold starts
app.get('/health', (req, res) => {
  const memoryMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const uptimeSeconds = Math.floor(process.uptime());
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.json({
    status: 'OK',
    message: 'JobMatcher API is running',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeSeconds}s`,
    memoryUsed: `${memoryMB} MB`,
    database: dbState[mongoose.connection.readyState] || 'unknown',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
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

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import middleware
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase (with error handling)
try {
  const { initializeFirebase } = require('./config/firebase');
  initializeFirebase();
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.log('⚠️  Firebase initialization skipped:', error.message);
  console.log('💡 Server will run without Firebase. Set up Firebase credentials in .env to enable database features.');
}

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce Warehouse API',
    version: '1.0.0',
    status: 'active',
    firebase: process.env.FIREBASE_PROJECT_ID ? 'configured' : 'not configured',
    timestamp: new Date().toISOString()
  });
});

// API Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/inventory', require('./routes/inventory'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/users', require('./routes/users'));
} catch (error) {
  console.log('⚠️  Some routes may not work without Firebase configuration');
}

// 404 handler (must be before error handler)
app.use(notFound);

// Global error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

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

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce Warehouse API',
    version: '1.0.0',
    status: 'active',
    firebase: process.env.FIREBASE_PROJECT_ID ? 'configured' : 'not configured'
  });
});

// API Routes (to be added)
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/inventory', require('./routes/inventory'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/users', require('./routes/users'));
} catch (error) {
  console.log('⚠️  Some routes may not work without Firebase configuration');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

/**
 * Error handling middleware
 * Catches and formats all errors in the application
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
  }

  // Firebase Auth errors
  if (err.code && err.code.startsWith('auth/')) {
    const authErrors = {
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Invalid credentials',
      'auth/email-already-in-use': 'Email already registered',
      'auth/weak-password': 'Password is too weak',
      'auth/invalid-email': 'Invalid email format',
      'auth/id-token-expired': 'Session expired, please login again',
      'auth/id-token-revoked': 'Session revoked, please login again'
    };

    return res.status(400).json({
      success: false,
      error: authErrors[err.code] || 'Authentication error'
    });
  }

  // Firestore errors
  if (err.code && err.code.startsWith('firestore/')) {
    return res.status(500).json({
      success: false,
      error: 'Database error'
    });
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid resource ID'
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

/**
 * Not found middleware
 * Handles requests to non-existent routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Async error handler wrapper
 * Wraps async functions to catch errors automatically
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};

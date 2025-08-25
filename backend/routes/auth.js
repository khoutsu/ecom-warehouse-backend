const express = require('express');
const router = express.Router();

// Import middleware
const { authLimiter } = require('../middleware/rateLimiter');
const { asyncHandler } = require('../middleware/errorHandler');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/auth
// @desc    Test auth route
// @access  Public
router.get('/', (req, res) => {
  res.json({ 
    message: 'Auth route working',
    timestamp: new Date().toISOString()
  });
});

// @route   POST /api/auth/verify
// @desc    Verify Firebase token and get user data
// @access  Private
router.post('/verify', 
  authLimiter,
  authMiddleware,
  asyncHandler(async (req, res) => {
    // If we reach here, the token is valid (checked by authMiddleware)
    res.json({
      success: true,
      message: 'Token verified successfully',
      user: {
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        isActive: req.user.isActive
      }
    });
  })
);

// @route   POST /api/auth/register
// @desc    Register user (handled by Firebase client-side)
// @access  Public
router.post('/register', 
  authLimiter,
  (req, res) => {
    res.json({ 
      message: 'User registration should be handled on the frontend using Firebase Auth',
      note: 'This endpoint is for reference only'
    });
  }
);

// @route   POST /api/auth/login
// @desc    Login user (handled by Firebase client-side)
// @access  Public
router.post('/login', 
  authLimiter,
  (req, res) => {
    res.json({ 
      message: 'User login should be handled on the frontend using Firebase Auth',
      note: 'This endpoint is for reference only'
    });
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', 
  authMiddleware,
  asyncHandler(async (req, res) => {
    // Firebase tokens are stateless, so we just confirm the logout
    res.json({
      success: true,
      message: 'Logout successful'
    });
  })
);

module.exports = router;

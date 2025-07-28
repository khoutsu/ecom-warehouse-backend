const express = require('express');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', (req, res) => {
  res.json({ message: 'Get all users endpoint' });
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id} endpoint` });
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', (req, res) => {
  res.json({ message: `Update user ${req.params.id} endpoint` });
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete user ${req.params.id} endpoint` });
});

module.exports = router;

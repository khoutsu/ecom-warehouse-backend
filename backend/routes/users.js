const express = require('express');
const router = express.Router();

// Import middleware
const authMiddleware = require('../middleware/auth');
const { adminMiddleware, ownerOrAdminMiddleware } = require('../middleware/roles');
const { validateUser, validateId } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', 
  authMiddleware, 
  adminMiddleware, 
  asyncHandler(async (req, res) => {
    try {
      const admin = require('firebase-admin');
      const usersSnapshot = await admin.firestore().collection('users').get();
      
      const users = [];
      usersSnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });

      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  })
);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (own profile or admin)
router.get('/:id', 
  authMiddleware, 
  validateId,
  ownerOrAdminMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const admin = require('firebase-admin');
      const userDoc = await admin.firestore().collection('users').doc(req.params.id).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { id: userDoc.id, ...userDoc.data() }
      });
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  })
);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (own profile or admin)
router.put('/:id', 
  authMiddleware, 
  validateId,
  validateUser,
  ownerOrAdminMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const admin = require('firebase-admin');
      const { name, email, role } = req.body;
      
      // Only admins can change roles
      if (role && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can change user roles'
        });
      }

      const updateData = {
        name,
        email,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      if (role && req.user.role === 'admin') {
        updateData.role = role;
      }

      await admin.firestore().collection('users').doc(req.params.id).update(updateData);

      res.json({
        success: true,
        message: 'User updated successfully'
      });
    } catch (error) {
      throw new Error('Failed to update user');
    }
  })
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', 
  authMiddleware, 
  adminMiddleware,
  validateId,
  asyncHandler(async (req, res) => {
    try {
      const admin = require('firebase-admin');
      
      // Prevent admin from deleting themselves
      if (req.params.id === req.user.uid) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete your own account'
        });
      }

      // Delete from Firestore
      await admin.firestore().collection('users').doc(req.params.id).delete();
      
      // Delete from Firebase Auth
      await admin.auth().deleteUser(req.params.id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  })
);

module.exports = router;

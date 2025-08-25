/**
 * Admin Role Middleware
 * Ensures only admin users can access certain endpoints
 */
const adminMiddleware = (req, res, next) => {
  try {
    // Check if user exists (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Customer Role Middleware
 * Ensures only customer or admin users can access certain endpoints
 */
const customerMiddleware = (req, res, next) => {
  try {
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Allow both customers and admins
    if (req.user.role !== 'customer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Customer or admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Customer middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Owner or Admin Middleware
 * Allows access if user is the owner of the resource or an admin
 */
const ownerOrAdminMiddleware = (req, res, next) => {
  try {
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Allow if user is admin
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is the owner (userId from URL params)
    const userId = req.params.userId || req.params.id;
    if (req.user.uid === userId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Access denied: You can only access your own resources'
    });

  } catch (error) {
    console.error('Owner or admin middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  adminMiddleware,
  customerMiddleware,
  ownerOrAdminMiddleware
};

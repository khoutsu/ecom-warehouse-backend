const admin = require('firebase-admin');

/**
 * Authentication Middleware
 * Verifies Firebase ID token and adds user info to request object
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      });
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Get user data from Firestore
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found in database'
      });
    }

    const userData = userDoc.data();

    // Check if user is active
    if (!userData.isActive) {
      return res.status(403).json({
        success: false,
        error: 'User account is inactive'
      });
    }

    // Add user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: userData.name,
      role: userData.role,
      isActive: userData.isActive,
      ...userData
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        error: 'Token revoked'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

module.exports = authMiddleware;

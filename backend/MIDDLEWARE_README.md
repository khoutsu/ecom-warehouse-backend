# Backend Middleware Documentation

This document explains the middleware implemented for the E-commerce Warehouse API.

## 🔐 Authentication Middleware (`middleware/auth.js`)

### Purpose
Verifies Firebase ID tokens and adds user information to request object.

### Usage
```javascript
const authMiddleware = require('./middleware/auth');

// Apply to protected routes
router.get('/protected', authMiddleware, (req, res) => {
  // req.user is now available
  console.log(req.user.uid, req.user.role);
});
```

### Features
- ✅ Verifies Firebase ID tokens
- ✅ Fetches user data from Firestore
- ✅ Checks if user account is active
- ✅ Adds user info to `req.user`
- ✅ Handles token expiration/revocation

## 👥 Role-Based Middleware (`middleware/roles.js`)

### Available Middlewares

#### 1. `adminMiddleware`
Ensures only admin users can access the endpoint.

```javascript
const { adminMiddleware } = require('./middleware/roles');

router.delete('/admin-only', authMiddleware, adminMiddleware, handler);
```

#### 2. `customerMiddleware`
Allows both customers and admins to access the endpoint.

```javascript
const { customerMiddleware } = require('./middleware/roles');

router.get('/customer-area', authMiddleware, customerMiddleware, handler);
```

#### 3. `ownerOrAdminMiddleware`
Allows access if user is the resource owner OR an admin.

```javascript
const { ownerOrAdminMiddleware } = require('./middleware/roles');

router.get('/users/:userId', authMiddleware, ownerOrAdminMiddleware, handler);
```

## 🚦 Rate Limiting (`middleware/rateLimiter.js`)

### Available Limiters

| Limiter | Window | Max Requests | Use Case |
|---------|--------|--------------|----------|
| `generalLimiter` | 15 min | 100 | General API endpoints |
| `authLimiter` | 15 min | 5 | Login/Register endpoints |
| `adminLimiter` | 15 min | 200 | Admin operations |
| `productLimiter` | 15 min | 300 | Product browsing |

### Usage
```javascript
const { authLimiter } = require('./middleware/rateLimiter');

router.post('/login', authLimiter, loginHandler);
```

## ✅ Validation Middleware (`middleware/validation.js`)

### Available Validators

#### Product Validation
```javascript
const { validateProduct } = require('./middleware/validation');

router.post('/products', validateProduct, createProduct);
```

#### User Validation
```javascript
const { validateUser } = require('./middleware/validation');

router.put('/users/:id', validateUser, updateUser);
```

#### ID Parameter Validation
```javascript
const { validateId } = require('./middleware/validation');

router.get('/products/:id', validateId, getProduct);
```

### Validation Rules

#### Product
- `name`: Required, 2-100 characters
- `description`: Optional, max 1000 characters
- `price`: Required, positive number
- `category`: Required, must be valid category
- `stock`: Required, non-negative integer

#### User
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `role`: Optional, must be 'admin' or 'customer'

## 🛡️ Error Handling (`middleware/errorHandler.js`)

### Features
- ✅ Catches all application errors
- ✅ Formats error responses consistently
- ✅ Handles Firebase-specific errors
- ✅ Provides detailed error info in development
- ✅ Logs errors for debugging

### Usage
```javascript
const { errorHandler, notFound, asyncHandler } = require('./middleware/errorHandler');

// Wrap async routes
router.get('/async-route', asyncHandler(async (req, res) => {
  // Async code here - errors automatically caught
}));

// Apply error handlers (in server.js)
app.use(notFound);      // 404 handler
app.use(errorHandler);  // Global error handler
```

## 🚀 Implementation Example

### Complete Route with All Middleware
```javascript
const express = require('express');
const router = express.Router();

// Import middleware
const authMiddleware = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/roles');
const { adminLimiter } = require('../middleware/rateLimiter');
const { validateProduct } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

// Create product endpoint
router.post('/products',
  adminLimiter,           // Rate limiting
  authMiddleware,         // Authentication
  adminMiddleware,        // Admin role required
  validateProduct,        // Input validation
  asyncHandler(async (req, res) => {  // Error handling
    // Route logic here
    const product = await ProductModel.create(req.body);
    res.json({ success: true, data: product });
  })
);
```

## 🔧 Configuration

### Environment Variables
```bash
# Add to .env
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Package Dependencies
```bash
npm install express-rate-limit express-validator
```

## 🎯 Security Benefits

1. **Authentication**: Every protected route verifies user identity
2. **Authorization**: Role-based access control prevents unauthorized actions
3. **Rate Limiting**: Prevents abuse and DoS attacks
4. **Input Validation**: Prevents injection attacks and data corruption
5. **Error Handling**: Prevents information leakage through error messages
6. **CORS Protection**: Controls which domains can access the API

## 📝 Best Practices

1. **Always use `authMiddleware` before role middlewares**
2. **Apply rate limiting to all public endpoints**
3. **Validate all user inputs**
4. **Use `asyncHandler` for async route handlers**
5. **Apply most restrictive middleware first**
6. **Test middleware order carefully**

## 🔍 Monitoring

All middleware includes logging for:
- Authentication attempts
- Rate limit violations
- Validation failures
- Authorization denials
- Error occurrences

Check server logs for security monitoring and debugging.

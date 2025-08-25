const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * Product validation rules
 */
const validateProduct = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['electronics', 'clothing', 'home', 'books', 'other'])
    .withMessage('Invalid category'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  handleValidationErrors
];

/**
 * User validation rules
 */
const validateUser = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('role')
    .optional()
    .isIn(['admin', 'customer'])
    .withMessage('Role must be either admin or customer'),
  
  handleValidationErrors
];

/**
 * Order validation rules
 */
const validateOrder = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one product'),
  
  body('products.*.productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  
  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  
  handleValidationErrors
];

/**
 * Inventory validation rules
 */
const validateInventory = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  
  body('quantity')
    .isInt()
    .withMessage('Quantity must be an integer'),
  
  body('operation')
    .isIn(['add', 'subtract', 'set'])
    .withMessage('Operation must be add, subtract, or set'),
  
  handleValidationErrors
];

/**
 * ID parameter validation
 */
const validateId = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isLength({ min: 1 })
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

/**
 * Pagination validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  validateProduct,
  validateUser,
  validateOrder,
  validateInventory,
  validateId,
  validatePagination,
  handleValidationErrors
};

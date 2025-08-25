const express = require('express');
const router = express.Router();
const ProductModel = require('../models/Product');

// Import middleware
const authMiddleware = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/roles');
const { productLimiter } = require('../middleware/rateLimiter');
const { validateProduct, validateId, validatePagination } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

// @route   GET /api/products
// @desc    Get all products with pagination
// @access  Public
router.get('/', 
  productLimiter,
  validatePagination,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await ProductModel.getAll(limit, skip);
    const total = await ProductModel.getCount();

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  })
);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', 
  productLimiter,
  validateId,
  asyncHandler(async (req, res) => {
    const product = await ProductModel.getById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  })
);

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, sku, barcode } = req.body;
    
    // Basic validation
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and category are required'
      });
    }

    const productData = {
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      sku: sku || '',
      barcode: barcode || '',
      active: true
    };

    const product = await ProductModel.create(productData);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, category, sku, barcode, active } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (sku !== undefined) updateData.sku = sku;
    if (barcode !== undefined) updateData.barcode = barcode;
    if (active !== undefined) updateData.active = active;

    const product = await ProductModel.update(req.params.id, updateData);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const result = await ProductModel.delete(req.params.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/products/search/:query
// @desc    Search products
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const products = await ProductModel.search(req.params.query);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

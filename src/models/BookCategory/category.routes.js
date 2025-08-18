const express = require('express');
const router = express.Router();
const { getCategoriesWithCounts, getBooksByCategory } = require('./category.controller');

// @route   GET /api/categories
// @desc    Get all categories with book counts
// @access  Public
router.get('/', getCategoriesWithCounts);

// @route   GET /api/categories/:categoryId/books
// @desc    Get books by category
// @access  Public
router.get('/:categoryId/books', getBooksByCategory);

module.exports = router;
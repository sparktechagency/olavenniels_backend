const express = require('express');
const router = express.Router();
const { getCategoriesWithCounts, getBooksByCategory } = require('./category.controller');

// @route   GET /api/categories
// @desc    Get all categories with book counts
// @access  Public
router.get('/', getCategoriesWithCounts);

// @route   GET /api/categories/books/:categoryId
// @desc    Get books by category with optional filtering and pagination
// @access  Public
// Example: GET /api/categories/books/123?type=audio&page=1&limit=10
router.get('/books', getBooksByCategory);

module.exports = router;
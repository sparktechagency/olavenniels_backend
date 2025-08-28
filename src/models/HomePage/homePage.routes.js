const express = require('express');
const router = express.Router();
const { getHomePageData, getBooksById, saveUnsaveBooks, getSavedBooks } = require('./homePage.controller');

// @route   GET /api/home
// @desc    Get home page data
// @access  Public
router.get('/', getHomePageData);

// @route   GET /api/home/:id
// @desc    Get book by id
// @access  Public
router.get('/book', getBooksById);

router.post('/save', saveUnsaveBooks);
router.get('/saved', getSavedBooks);

module.exports = router;
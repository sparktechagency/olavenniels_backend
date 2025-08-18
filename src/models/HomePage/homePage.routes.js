const express = require('express');
const router = express.Router();
const { getHomePageData } = require('./homePage.controller');

// @route   GET /api/home
// @desc    Get home page data
// @access  Public
router.get('/', getHomePageData);

module.exports = router;
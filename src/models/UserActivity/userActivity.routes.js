const express = require('express');
const router = express.Router();
const { updateReadingProgress, getUserStatistics } = require('./userActivity.controller');
const { protect } = require('../../middleware/authMiddleware');

// @route   PUT /api/user-activity/progress
// @desc    Update reading progress
// @access  Private
router.put('/progress', protect, updateReadingProgress);

// @route   GET /api/user-activity/statistics
// @desc    Get user reading statistics
// @access  Private
router.get('/statistics', protect, getUserStatistics);

module.exports = router;

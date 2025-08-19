const express = require('express');
const router = express.Router();
const { updateReadingProgress, getUserStatistics } = require('./userActivity.controller');
const { authUser } = require('../../middleware/authMiddleware');

// @route   PUT /api/user-activity/progress
// @desc    Update reading progress
// @access  Private
router.put('/progress', authUser, updateReadingProgress);

// @route   GET /api/user-activity/statistics
// @desc    Get user reading statistics
// @access  Private
router.get('/statistics', authUser, getUserStatistics);

module.exports = router;

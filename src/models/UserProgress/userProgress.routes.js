const express = require('express');
const router = express.Router();
const UserProgressController = require('./userProgress.controller');
const { authUser } = require('../../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authUser);

// Update progress for reading/listening
router.put('/:contentType/:contentId/progress', UserProgressController.updateProgress);

// Get continue reading/listening items
router.get('/continue', UserProgressController.getContinueItems);

// Get user's reading/listening history
router.get('/history', UserProgressController.getHistory);

// Get user's bookmarked items
router.get('/bookmarks', UserProgressController.getBookmarks);

// Get user's activity statistics
router.get('/activity', UserProgressController.getActivityStats);

// Get progress for specific content
router.get('/progress', UserProgressController.getContentProgress);

// Toggle bookmark status
router.patch('/bookmark', UserProgressController.toggleBookmark);

// Get dashboard data (continue items + activity stats)
router.get('/dashboard', UserProgressController.getDashboard);

module.exports = router; 
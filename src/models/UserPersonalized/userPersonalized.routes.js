const express = require('express');
const router = express.Router();
const UserPersonalizedController = require('./userPersonalized.controller');
const { authUser } = require('../../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authUser);

// Get personalized content (complete personalized data)
router.get('/content', UserPersonalizedController.getPersonalizedContent);

// Get personalized dashboard (continue items + activity stats)
router.get('/dashboard', UserPersonalizedController.getPersonalizedDashboard);

// Get continue reading/listening items
router.get('/continue', UserPersonalizedController.getContinueItems);

// Get user's activity statistics
router.get('/activity', UserPersonalizedController.getActivityStats);

// Get user's reading/listening history
router.get('/history/:contentType', UserPersonalizedController.getHistory);

// Get user's bookmarked items
router.get('/bookmarks/:contentType', UserPersonalizedController.getBookmarks);

module.exports = router; 
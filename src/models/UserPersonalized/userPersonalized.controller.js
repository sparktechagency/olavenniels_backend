const UserPersonalizedService = require('./userPersonalized.service');
const sendResponse = require('../../utils/sendResponse');

class UserPersonalizedController {
  // Get personalized content for authenticated user
  static getPersonalizedContent = async (req, res) => {
    try {
      const { id: userId } = req.user;
      const result = await UserPersonalizedService.getPersonalizedContent(userId);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Personalized content retrieved successfully',
        data: result
      });
    } catch (error) {
              sendResponse(res, {
          statusCode: 500,
          success: false,
          message: 'Error retrieving personalized content',
          data: null
        });
    }
  };

  // Get personalized dashboard for authenticated user
  static getPersonalizedDashboard = async (req, res) => {
    try {
      const { id: userId } = req.user;
      const result = await UserPersonalizedService.getPersonalizedDashboard(userId);
              sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Personalized dashboard retrieved successfully',
          data: result
        });
    } catch (error) {
              sendResponse(res, {
          statusCode: 500,
          success: false,
          message: 'Error retrieving personalized dashboard',
          data: null
        });
    }
  };

  // Get user's continue reading/listening items
  static getContinueItems = async (req, res) => {
    try {
      const { id: userId } = req.user;
      const { limit = 10 } = req.query;
      
      const UserProgressService = require('../UserProgress/userProgress.service');
      const result = await UserProgressService.getContinueItems(userId, parseInt(limit));
              sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Continue items retrieved successfully',
          data: result
        });
    } catch (error) {
              sendResponse(res, {
          statusCode: 500,
          success: false,
          message: 'Error retrieving continue items',
          data: null
        });
    }
  };

  // Get user's activity statistics
  static getActivityStats = async (req, res) => {
    try {
      const { id: userId } = req.user;
      const { period = 'week' } = req.query;
      
      const UserProgressService = require('../UserProgress/userProgress.service');
      const result = await UserProgressService.getActivityStats(userId, period);
              sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Activity stats retrieved successfully',
          data: result
        });
    } catch (error) {
              sendResponse(res, {
          statusCode: 500,
          success: false,
          message: 'Error retrieving activity stats',
          data: null
        });
    }
  };

  // Get user's reading/listening history
  static getHistory = async (req, res) => {
    try {
      const { id: userId } = req.user;
      const { contentType } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const UserProgressService = require('../UserProgress/userProgress.service');
      const result = await UserProgressService.getHistory(
        userId,
        contentType,
        parseInt(page),
        parseInt(limit)
      );
              sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'History retrieved successfully',
          data: result
        });
    } catch (error) {
              sendResponse(res, {
          statusCode: 500,
          success: false,
          message: 'Error retrieving history',
          data: null
        });
    }
  };

  // Get user's bookmarked items
  static getBookmarks = async (req, res) => {
    try {
      const { id: userId } = req.user;
      const { contentType } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const UserProgressService = require('../UserProgress/userProgress.service');
      const result = await UserProgressService.getBookmarks(
        userId,
        contentType,
        parseInt(page),
        parseInt(limit)
      );
              sendResponse(res, {
          statusCode: 200,
          success: true,
          message: 'Bookmarks retrieved successfully',
          data: result
        });
    } catch (error) {
              sendResponse(res, {
          statusCode: 500,
          success: false,
          message: 'Error retrieving bookmarks',
          data: null
        });
    }
  };
}

module.exports = UserPersonalizedController; 
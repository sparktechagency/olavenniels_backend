const UserProgressService = require('../UserProgress/userProgress.service');
const asyncHandler = require('../../utils/asyncHandler');

class UserPersonalizedService {
  // Get personalized content for a specific user
  static getPersonalizedContent = asyncHandler(async (userId) => {
    try {
      // Get user's continue items and activity stats
      const [continueItems, activityStats] = await Promise.all([
        UserProgressService.getContinueItems(userId, 5),
        UserProgressService.getActivityStats(userId, 'week')
      ]);

      // Get trending content (you can implement this based on your business logic)
      const trendingContent = await this.getTrendingContent();

      // Mark trending items that user is already reading/listening
      const personalizedTrending = await this.markUserProgressInTrending(
        userId,
        trendingContent
      );

      // Get recommended content based on user's reading history
      const recommendations = await this.getPersonalizedRecommendations(userId);

      return {
        continueItems,
        activityStats,
        trendingContent: personalizedTrending,
        recommendations,
        summary: {
          totalReadingTime: activityStats.totals.readingMinutes,
          totalListeningTime: activityStats.totals.listeningMinutes,
          activeBooks: continueItems.continueReading.length + continueItems.continueListening.length,
          weeklyGoal: this.calculateWeeklyGoal(activityStats.totals)
        }
      };
    } catch (error) {
      throw new Error(`Error getting personalized content: ${error.message}`);
    }
  });

  // Get trending content (implement based on your business logic)
  static getTrendingContent = asyncHandler(async () => {
    // This is a placeholder - implement your trending logic
    // You can base this on:
    // - Most read/listened books
    // - Highest rated books
    // - New releases
    // - Popular categories
    
    return {
      trendingEbooks: [],
      trendingAudiobooks: [],
      trendingBooks: []
    };
  });

  // Mark trending items that user is already reading/listening
  static markUserProgressInTrending = asyncHandler(async (userId, trendingContent) => {
    try {
      // Get user's current progress for trending items
      const userProgressMap = new Map();

      // Check ebooks
      for (const ebook of trendingContent.trendingEbooks) {
        const progress = await UserProgressService.getContentProgress(
          userId,
          ebook._id,
          'ebook'
        );
        if (progress) {
          userProgressMap.set(ebook._id.toString(), {
            contentType: 'ebook',
            progress: progress.progress,
            currentPage: progress.currentPage,
            totalPages: progress.totalPages,
            isReading: true,
            lastReadAt: progress.lastReadAt
          });
        }
      }

      // Check audiobooks
      for (const audiobook of trendingContent.trendingAudiobooks) {
        const progress = await UserProgressService.getContentProgress(
          userId,
          audiobook._id,
          'audiobook'
        );
        if (progress) {
          userProgressMap.set(audiobook._id.toString(), {
            contentType: 'audiobook',
            progress: progress.progress,
            currentTime: progress.currentTime,
            totalDuration: progress.totalDuration,
            isListening: true,
            lastListenAt: progress.lastListenAt
          });
        }
      }

      // Check books
      for (const book of trendingContent.trendingBooks) {
        const progress = await UserProgressService.getContentProgress(
          userId,
          book._id,
          'book'
        );
        if (progress) {
          userProgressMap.set(book._id.toString(), {
            contentType: 'book',
            progress: progress.progress,
            currentPage: progress.currentPage,
            totalPages: progress.totalPages,
            isReading: true,
            lastReadAt: progress.lastReadAt
          });
        }
      }

      // Mark trending content with user progress
      const personalizedTrending = {
        trendingEbooks: trendingContent.trendingEbooks.map(ebook => ({
          ...ebook.toObject(),
          userProgress: userProgressMap.get(ebook._id.toString()) || null
        })),
        trendingAudiobooks: trendingContent.trendingAudiobooks.map(audiobook => ({
          ...audiobook.toObject(),
          userProgress: userProgressMap.get(audiobook._id.toString()) || null
        })),
        trendingBooks: trendingContent.trendingBooks.map(book => ({
          ...book.toObject(),
          userProgress: userProgressMap.get(book._id.toString()) || null
        }))
      };

      return personalizedTrending;
    } catch (error) {
      console.error('Error marking user progress in trending:', error);
      return trendingContent; // Return original if marking fails
    }
  });

  // Get personalized recommendations based on user's reading history
  static getPersonalizedRecommendations = asyncHandler(async (userId) => {
    try {
      // Get user's reading preferences from history
      const userPreferences = await this.analyzeUserPreferences(userId);
      
      // Based on preferences, recommend similar content
      // This is a placeholder - implement your recommendation algorithm
      
      return {
        recommendedEbooks: [],
        recommendedAudiobooks: [],
        recommendedBooks: [],
        reason: 'Based on your reading history'
      };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return {
        recommendedEbooks: [],
        recommendedAudiobooks: [],
        recommendedBooks: [],
        reason: 'Popular content'
      };
    }
  });

  // Analyze user preferences from reading history
  static analyzeUserPreferences = asyncHandler(async (userId) => {
    try {
      // Get user's completed books to analyze preferences
      const completedBooks = await UserProgressService.getHistory(userId, 'ebook', 1, 100);
      const completedAudiobooks = await UserProgressService.getHistory(userId, 'audiobook', 1, 100);
      const completedPhysicalBooks = await UserProgressService.getHistory(userId, 'book', 1, 100);

      // Analyze categories, authors, genres, etc.
      // This is a placeholder - implement your preference analysis
      
      return {
        preferredCategories: [],
        preferredAuthors: [],
        preferredGenres: [],
        readingPatterns: {
          averagePagesPerSession: 0,
          preferredReadingTime: 'evening',
          completionRate: 0
        }
      };
    } catch (error) {
      console.error('Error analyzing user preferences:', error);
      return {};
    }
  });

  // Calculate weekly reading goals
  static calculateWeeklyGoal = (totals) => {
    const currentWeek = {
      readingMinutes: totals.readingMinutes,
      listeningMinutes: totals.listeningMinutes,
      pagesRead: totals.pagesRead
    };

    // Define goals (you can make these configurable)
    const goals = {
      readingMinutes: 300, // 5 hours per week
      listeningMinutes: 180, // 3 hours per week
      pagesRead: 100 // 100 pages per week
    };

    const progress = {
      reading: Math.min((currentWeek.readingMinutes / goals.readingMinutes) * 100, 100),
      listening: Math.min((currentWeek.listeningMinutes / goals.listeningMinutes) * 100, 100),
      pages: Math.min((currentWeek.pagesRead / goals.pagesRead) * 100, 100)
    };

    return {
      current: currentWeek,
      goals,
      progress,
      isOnTrack: progress.reading >= 80 && progress.listening >= 80 && progress.pages >= 80
    };
  };

  // Get user's personalized dashboard
  static getPersonalizedDashboard = asyncHandler(async (userId) => {
    try {
      const [continueItems, activityStats] = await Promise.all([
        UserProgressService.getContinueItems(userId, 10),
        UserProgressService.getActivityStats(userId, 'week')
      ]);

      const dashboardData = {
        continueItems,
        activityStats,
        summary: {
          totalReadingTime: activityStats.totals.readingMinutes,
          totalListeningTime: activityStats.totals.listeningMinutes,
          totalPagesRead: activityStats.totals.pagesRead,
          totalTimeListened: activityStats.totals.timeListened,
          activeBooks: continueItems.continueReading.length + continueItems.continueListening.length,
          weeklyGoal: this.calculateWeeklyGoal(activityStats.totals)
        }
      };

      return dashboardData;
    } catch (error) {
      throw new Error(`Error getting personalized dashboard: ${error.message}`);
    }
  });
}

module.exports = UserPersonalizedService; 
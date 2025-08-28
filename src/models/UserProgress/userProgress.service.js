const UserProgress = require('./UserProgress');
const UserActivity = require('../UserActivity/UserActivity');
const asyncHandler = require('../../utils/asyncHandler');
const { ApiError } = require('../../errors/errorHandler');
const AudioBook = require('../AudioBook/AudioBook');
const Book = require('../Book/Book');
const Ebook = require('../Ebook/Ebook');

const mapContentTypeToModel = (type) => {
  switch (type) {
    case 'ebook': return 'Ebook';
    case 'audiobook': return 'AudioBook';
    case 'book': return 'Book';
    default: return null;
  }
};

class UserProgressService {
  // Update or create user progress
  static updateProgress = async (userId, contentId, contentType, progressData = {}) => {
    const {
      progress,
      currentPage,
      totalPages,
      currentTime,
      totalDuration,
      isCompleted = false,
      bookmarked
    } = progressData;

    // Validate contentType
    if (!['ebook', 'audiobook', 'book'].includes(contentType)) {
      throw new ApiError('Invalid contentType. Allowed: ebook, audiobook, book', 400);
    }

    // Ensure at least one updatable field is provided
    const hasAnyField = [progress, currentPage, totalPages, currentTime, totalDuration, isCompleted, bookmarked]
      .some(value => value !== undefined);
    if (!hasAnyField) {
      throw new ApiError('No progress fields provided to update', 400);
    }

    // Find existing progress or create new one
    let userProgress = await UserProgress.findOne({
      userId,
      contentId,
      contentType
    });

    if (!userProgress) {
      const contentModel = mapContentTypeToModel(contentType);
      if (!contentModel) {
        throw new ApiError('Invalid contentType. Allowed: ebook, audiobook, book', 400);
      }

      userProgress = new UserProgress({
        userId,
        contentId,
        contentType,
        contentModel,     // <- set this so refPath works
        startedAt: new Date()
      });
    }

    // Update progress fields
    if (progress !== undefined) userProgress.progress = progress;
    if (currentPage !== undefined) userProgress.currentPage = currentPage;
    if (totalPages !== undefined) userProgress.totalPages = totalPages;
    if (currentTime !== undefined) userProgress.currentTime = currentTime;
    if (totalDuration !== undefined) userProgress.totalDuration = totalDuration;
    if (isCompleted !== undefined) userProgress.isCompleted = isCompleted;
    if (bookmarked !== undefined) userProgress.bookmarked = bookmarked;

    // Update timestamps based on content type
    if (contentType === 'ebook' || contentType === 'book') {
      userProgress.lastReadAt = new Date();
    } else if (contentType === 'audiobook') {
      userProgress.lastListenAt = new Date();
    }

    await userProgress.save();

    // Update daily activity
    await this.updateDailyActivity(userId, contentType, progressData);

    return userProgress;
  };

  // Get user's continue reading/listening items
  static getContinueItems = async (userId, limit = 10) => {
    const continueReading = await UserProgress.find({
      userId,
      contentType: 'ebook' || 'book',
      isCompleted: false
    })
    .sort({ lastReadAt: -1 })
    .limit(limit)
    .populate('contentId', 'bookCover bookName categoryName synopsis');

    const continueListening = await UserProgress.find({
      userId,
      contentType: 'audiobook' || 'book',
      isCompleted: false
    })
    .sort({ lastListenAt: -1 })
    .limit(limit)
    .populate('contentId', 'bookCover bookName categoryName synopsis');
    

    return {
      continueReading,
      continueListening
    };
  };

  // Get user's reading/listening history
  static getHistory = async (userId, contentType, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    
    const history = await UserProgress.find({
      userId,
      contentType
    })
    .sort({ 
      [contentType === 'audiobook' ? 'lastListenAt' : 'lastReadAt']: -1 
    })
    .skip(skip)
    .limit(limit)
    .populate('contentId', 'title subtitle coverImage author');

    const total = await UserProgress.countDocuments({
      userId,
      contentType
    });

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  };

  // Get user's bookmarked items
  static getBookmarks = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    
    const bookmarks = await UserProgress.find({
      userId,
      bookmarked: true
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('contentId', 'title subtitle coverImage author');

    const total = await UserProgress.countDocuments({
      userId,
      bookmarked: true
    });

    return {
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  };

  // Update daily activity tracking
  static updateDailyActivity = async (userId, contentType, progressData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let userActivity = await UserActivity.findOne({
      userId,
      date: today
    });

    if (!userActivity) {
      userActivity = new UserActivity({
        userId,
        date: today
      });
    }

    if (contentType === 'ebook' || contentType === 'book') {
      if (progressData.currentPage && progressData.currentPage > 0) {
        userActivity.pagesRead += 1;
      }
      userActivity.readingMinutes += 1; // Assuming 1 minute per update
      userActivity.ebooksRead = 1; // Count as 1 session
    } else if (contentType === 'audiobook') {
      if (progressData.currentTime && progressData.currentTime > 0) {
        userActivity.timeListened += 30; // Assuming 30 seconds per update
      }
      userActivity.listeningMinutes += 1;
      userActivity.audiobooksListened = 1;
    }

    await userActivity.save();
  };

  // Get user's weekly/monthly activity
  static getActivityStats = async (userId, period = 'week') => {
    const now = new Date();
    let startDate;

    if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    }

    const activities = await UserActivity.find({
      userId,
      date: { $gte: startDate, $lte: now }
    }).sort({ date: 1 });

    // Calculate totals
    const totals = activities.reduce((acc, activity) => {
      acc.readingMinutes += activity.readingMinutes;
      acc.listeningMinutes += activity.listeningMinutes;
      acc.pagesRead += activity.pagesRead;
      acc.timeListened += activity.timeListened;
      acc.ebooksRead += activity.ebooksRead;
      acc.audiobooksListened += activity.audiobooksListened;
      return acc;
    }, {
      readingMinutes: 0,
      listeningMinutes: 0,
      pagesRead: 0,
      timeListened: 0,
      ebooksRead: 0,
      audiobooksListened: 0
    });

    // Calculate daily breakdown for charts
    const dailyBreakdown = activities.map(activity => ({
      date: activity.date,
      reading: activity.readingMinutes,
      listening: activity.listeningMinutes,
      ebooks: activity.ebooksRead,
      audiobooks: activity.audiobooksListened
    }));

    return {
      period,
      totals,
      dailyBreakdown,
      activities
    };
  };

  // Get user's progress for a specific content
  static getContentProgress = async (userId, contentId, contentType) => {
    const progress = await UserProgress.findOne({
      userId,
      contentId,
      contentType
    });

    return progress;
  };

  // Toggle bookmark status
  static toggleBookmark = async (userId, contentId ) => {
    const book = await Ebook.findOne(contentId) || await AudioBook.findOne(contentId) || await Book.findOne(contentId);
    
    const progress = await UserProgress.findOne({
      userId,
      contentId,
    });

    if (!progress) {
      throw new Error('Progress not found. Start reading/listening first.');
    }

    progress.bookmarked = !progress.bookmarked;
    await progress.save();

    return progress;
  };
}

module.exports = UserProgressService;
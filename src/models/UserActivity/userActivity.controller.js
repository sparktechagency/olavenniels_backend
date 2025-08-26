const UserActivity = require('./UserActivity');
const asyncHandler = require('../../utils/asyncHandler');
const { startOfDay, endOfDay, subDays, eachDayOfInterval } = require('date-fns');

// @desc    Update reading progress
// @route   PUT /api/user-activity/progress
// @access  Private
const updateReadingProgress = asyncHandler(async (req, res) => {
    const { bookId, bookType, progress, currentPage, currentTime } = req.body;
    const userId = req.user._id;

    // Validate book type
    if (!['AudioBook', 'Ebook', 'Book'].includes(bookType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid book type. Must be either "AudioBook" or "Ebook" or "Book"'
        });
    }

    let updateData = {
        progress: Math.min(100, Math.max(0, progress || 0)),
        lastRead: new Date()
    };

    if (currentPage !== undefined) updateData.currentPage = currentPage;
    if (currentTime !== undefined) updateData.currentTime = currentTime;

    const activity = await UserActivity.findOneAndUpdate(
        { user: userId, book: bookId, bookType },
        {
            $set: updateData,
            $inc: { timeSpent: 5 } // Assuming 5 seconds per update, adjust as needed
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('book', 'bookName bookCover');

    res.json({
        success: true,
        data: activity
    });
});

// @desc    Get user reading statistics
// @route   GET /api/user-activity/statistics
// @access  Private
const getUserStatistics = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const sevenDaysAgo = subDays(new Date(), 7);

    // Get currently reading books
    const currentlyReading = await UserActivity.find({
        user: userId,
        status: 'reading'
    })
    .populate('book', 'bookName bookCover')
    .sort({ lastRead: -1 })
    .limit(5);

    // Get recently completed books
    const recentlyCompleted = await UserActivity.find({
        user: userId,
        status: 'completed'
    })
    .populate('book', 'bookName bookCover')
    .sort({ updatedAt: -1 })
    .limit(5);

    // Get 7-day activity data
    const activityData = await UserActivity.aggregate([
        {
            $match: {
                user: userId,
                lastRead: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$lastRead' },
                    bookType: '$bookType'
                },
                timeSpent: { $sum: '$timeSpent' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.date': 1 }
        }
    ]);

    // Format activity data for chart
    const days = eachDayOfInterval({
        start: sevenDaysAgo,
        end: new Date()
    });

    const formattedActivity = days.map(day => {
        const dayStr = day.toISOString().split('T')[0];
        const dayData = {
            date: dayStr,
            Ebook: 0,
            AudioBook: 0
        };

        activityData.forEach(item => {
            if (item._id.date === dayStr) {
                dayData[item._id.bookType] = Math.floor(item.timeSpent / 60); // Convert to minutes
            }
        });

        return dayData;
    });

    // Calculate total statistics
    const totalStats = await UserActivity.aggregate([
        {
            $match: { user: userId }
        },
        {
            $group: {
                _id: '$bookType',
                totalBooks: { $sum: 1 },
                totalTime: { $sum: '$timeSpent' },
                completed: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
                    }
                }
            }
        }
    ]);

    const stats = {
        Ebook: { totalBooks: 0, totalTime: 0, completed: 0 },
        AudioBook: { totalBooks: 0, totalTime: 0, completed: 0 }
    };

    totalStats.forEach(stat => {
        stats[stat._id] = {
            totalBooks: stat.totalBooks,
            totalTime: Math.floor(stat.totalTime / 60), // Convert to minutes
            completed: stat.completed
        };
    });

    res.json({
        success: true,
        data: {
            currentlyReading,
            recentlyCompleted,
            activity: formattedActivity,
            stats
        }
    });
});

module.exports = {
    updateReadingProgress,
    getUserStatistics
};

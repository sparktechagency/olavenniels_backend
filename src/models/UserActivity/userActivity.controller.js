const mongoose = require('mongoose');
const UserActivity = require('./UserActivity');
const asyncHandler = require('../../utils/asyncHandler');
const { startOfDay, endOfDay, subDays, eachDayOfInterval } = require('date-fns');

// @desc    Update reading/listening progress
// @route   POST /api/user-activity/progress
// @access  Private
const updateReadingProgress = asyncHandler(async (req, res) => {
    const { 
        bookId, 
        bookType, 
        progress, 
        currentPage, 
        currentTime,
        activityType = 'read' // 'read' or 'listen'
    } = req.body;
    
    const userId = req.user._id;

    // Validate book type
    if (!['AudioBook', 'Ebook', 'Book'].includes(bookType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid book type. Must be either "AudioBook", "Ebook", or "Book"'
        });
    }

    // Validate activity type
    if (!['read', 'listen'].includes(activityType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid activity type. Must be either "read" or "listen"'
        });
    }

    // Get existing activity or create a new one
    let activity = await UserActivity.findOne({ 
        user: userId, 
        bookId: bookId, 
        bookType 
    });

    // Prepare update data
    const updateData = {
        lastActivityType: activityType,
        lastRead: activityType === 'read' ? new Date() : activity?.lastRead,
        lastListened: activityType === 'listen' ? new Date() : activity?.lastListened,
        $inc: {}
    };

    // Update read progress
    if (activityType === 'read' && progress !== undefined) {
        updateData.readProgress = Math.min(100, Math.max(0, progress));
        updateData.$inc.timeSpentReading = 5; // 5 seconds per update
        if (currentPage !== undefined) updateData.currentPage = currentPage;
    }

    // Update listen progress
    if (activityType === 'listen' && currentTime !== undefined) {
        updateData.listenProgress = Math.min(100, Math.max(0, progress || 0));
        updateData.currentTime = currentTime;
        updateData.$inc.timeSpentListening = 5; // 5 seconds per update
    }

    // Calculate overall progress (max of read and listen progress)
    const newReadProgress = activityType === 'read' ? 
        Math.min(100, Math.max(0, progress)) : 
        (activity?.readProgress || 0);
    
    const newListenProgress = activityType === 'listen' ? 
        Math.min(100, Math.max(0, progress || 0)) : 
        (activity?.listenProgress || 0);
    
    updateData.progress = Math.max(newReadProgress, newListenProgress);

    // Update status based on progress
    if (updateData.progress >= 100) {
        updateData.status = 'completed';
    } else if (activity?.status === 'completed' && updateData.progress < 100) {
        updateData.status = 'reading';
    }

    // Update or create the activity
    activity = await UserActivity.findOneAndUpdate(
        { user: userId, bookId: bookId, bookType },
        updateData,
        { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('bookId', 'title coverImage');

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
    .populate('bookId', 'title coverImage')
    .sort({ lastRead: -1 })
    .limit(5);

    // Get recently completed books
    const recentlyCompleted = await UserActivity.find({
        user: userId,
        status: 'completed'
    })
    .populate('bookId', 'title coverImage')
    .sort({ updatedAt: -1 })
    .limit(5);

    // Get 7-day activity data
    const activityData = await UserActivity.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                lastRead: { $gte: sevenDaysAgo }
            }
        },
        {
            $addFields: {
                dateStr: { $dateToString: { format: '%Y-%m-%d', date: '$lastRead' } }
            }
        },
        {
            $group: {
                _id: {
                    date: '$dateStr',
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

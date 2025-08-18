const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'bookType'
    },
    bookType: {
        type: String,
        required: true,
        enum: ['AudioBook', 'Ebook']
    },
    progress: {
        type: Number, // Percentage of completion (0-100)
        default: 0,
        min: 0,
        max: 100
    },
    lastRead: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['reading', 'completed', 'on-hold', 'dropped'],
        default: 'reading'
    },
    timeSpent: {
        type: Number, // in seconds
        default: 0
    },
    currentPage: {
        type: Number,
        default: 1
    },
    currentTime: {
        type: Number, // in seconds (for audio books)
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
userActivitySchema.index({ user: 1, lastRead: -1 });
userActivitySchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);

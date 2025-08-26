const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'bookType'
    },
    bookType: {
        type: String,
        required: true,
        enum: ['AudioBook', 'Ebook', 'Book']
    },
    // Combined progress (auto-calculated from read and listen progress)
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Reading progress (for PDF/ebook)
    readProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Listening progress (for audio)
    listenProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastRead: {
        type: Date,
        default: Date.now
    },
    lastListened: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['reading', 'completed', 'on-hold', 'dropped'],
        default: 'reading'
    },
    timeSpentReading: {
        type: Number, // in seconds
        default: 0
    },
    timeSpentListening: {
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
    },
    lastActivityType: {
        type: String,
        enum: ['read', 'listen', null],
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
userActivitySchema.index({ user: 1, lastRead: -1 });
userActivitySchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);

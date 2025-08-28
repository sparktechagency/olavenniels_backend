const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  readingMinutes: {
    type: Number,
    default: 0
  },
  listeningMinutes: {
    type: Number,
    default: 0
  },
  ebooksRead: {
    type: Number,
    default: 0
  },
  audiobooksListened: {
    type: Number,
    default: 0
  },
  pagesRead: {
    type: Number,
    default: 0
  },
  timeListened: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
userActivitySchema.index({ userId: 1, date: -1 });
userActivitySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('UserActivity', userActivitySchema); 
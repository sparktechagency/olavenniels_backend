const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "User"
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Admin"
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);

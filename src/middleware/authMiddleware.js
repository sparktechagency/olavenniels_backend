const jwt = require("jsonwebtoken");
const User = require("../models/User/User");
const { ApiError } = require("../errors/errorHandler");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Middleware to protect routes (authenticate users)
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError("Not authorized. No token provided.", 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new ApiError("User not found.", 404);

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError("Not authorized. Invalid or expired token.", 401);
  }
});

/**
 * Middleware to restrict access by roles
 * Usage: restrictTo('ADMIN'), restrictTo('SUPER_ADMIN')
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError("You do not have permission to perform this action.", 403);
    }
    next();
  };
};

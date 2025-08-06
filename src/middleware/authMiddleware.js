const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const ApiError = require("../errors/errorHandler");
const User = require("../models/User/User");

exports.auth = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("Authentication token missing", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user & attach to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) throw new ApiError("User not found", 404);

    // Ensure email is verified (only for regular users)
    if (user.role === "USER" && !user.isVerified) {
      throw new ApiError("Email not verified. Please verify before continuing.", 403);
    }

    // Role-based authorization
    if (roles.length && !roles.includes(user.role)) {
      throw new ApiError("Access denied: Insufficient permissions", 403);
    }

    req.user = user;
    next();
  });
};

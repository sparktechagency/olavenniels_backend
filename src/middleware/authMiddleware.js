const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const {ApiError} = require("../errors/errorHandler");
const User = require("../models/User/User");
const Admin = require("../models/Admin/Admin");
exports.authUser = asyncHandler(async (req, res, next) => {
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

  req.user = {
    id: decoded.id,
    role: decoded.role
  };
  next();
});

exports.authAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Authentication token missing", 401);
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find admin & attach to request
  const admin = await Admin.findById(decoded.id).select("-password");
  if (!admin) throw new ApiError("Admin not found", 404);

  // Ensure email is verified (only for regular users)
  if (admin.role === "ADMIN" || admin.role === "SUPER_ADMIN" && !admin.isVerified) {
    throw new ApiError("Email not verified. Please verify before continuing.", 403);
  }

  req.admin = {
    id: decoded.id,
    role: decoded.role
  };
  next();
});

exports.authSuperAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Authentication token missing", 401);
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find admin & attach to request
  const admin = await Admin.findById(decoded.id).select("-password");
  if (!admin) throw new ApiError("Admin not found", 404);

  // Ensure email is verified (only for regular users)
  if (admin.role === "SUPER_ADMIN" && !admin.isVerified) {
    throw new ApiError("Email not verified. Please verify before continuing.", 403);
  }

  req.admin = {
    id: decoded.id,
    role: decoded.role
  };
  next();
});
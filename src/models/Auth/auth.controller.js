const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./auth.service");
const bcrypt = require("bcryptjs");

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, country } = req.body;
  const response = await authService.registerUser({
    firstName,
    lastName,
    email,
    password,
    country,
  });
  res.status(201).json({
    success: true,
    message: response.message,
  });
});

/**
 * @desc    Verify email with code
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const response = await authService.verifyEmail(email, code);
  res.status(200).json({
    success: true,
    message: response.message,
  });
});

/**
 * @desc    Login (User/Admin/Super Admin)
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const response = await authService.login(email, password);

  res.status(200).json({
    success: true,
    token: response.token,
    user: response.user,
  });
});

/**
 * @desc    Forgot password - send reset code
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const response = await authService.forgotPassword(email);
  res.status(200).json({
    success: true,
    message: response.message,
  });
});

/**
 * @desc    Reset password with code
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const response = await authService.resetPassword(email, code, newPassword);
  res.status(200).json({
    success: true,
    message: response.message,
  });
});

/**
 * @desc    Super Admin creates Admin
 * @route   POST /api/auth/create-admin
 * @access  Private (Super Admin only)
 */
exports.createAdmin = asyncHandler(async (req, res) => {
  const response = await authService.createAdmin(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: response.message,
    admin: response.admin,
  });
});


exports.resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const response = await authService.resendVerification(email);
  
    res.status(200).json({
      success: true,
      message: response.message,
    });
  });

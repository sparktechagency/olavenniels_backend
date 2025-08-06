const express = require("express");
const authController = require("./auth.controller");
const { protect, restrictTo } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/resend-verification", authController.resendVerification);
// router.post("/create-admin", protect, restrictTo("SUPER_ADMIN"), authController.createAdmin);

module.exports = router;

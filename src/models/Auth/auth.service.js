const bcrypt = require("bcryptjs");
const User = require("../User/User");
const emailService = require("../../utils/emailService");
const tokenService = require("../../utils/tokenService");
const { ApiError } = require("../../errors/errorHandler");

class AuthService {
  /**
   * Register a new user (with email verification).
   * If user exists but unverified and expired → delete and re-register.
   * If user exists but unverified and still valid → resend verification.
   */
  async registerUser({ firstName, lastName, email, password, country }) {
    const existing = await User.findOne({ email });

    if (existing) {
      // If user exists but is not verified
      if (!existing.isVerified) {
        const isExpired =
          !existing.verificationCode.expiresAt || Date.now() > existing.verificationCode.expiresAt;

        if (isExpired) {
          // Delete old unverified account
          await User.deleteOne({ email });
        } else {
          // Resend code if still valid
          await emailService.sendVerificationCode(email, existing.verificationCode.code);
          throw new ApiError(
            "Email already registered but not verified. A verification code has been resent.",
            400
          );
        }
      } else {
        // Verified user exists
        throw new ApiError("Email already in use", 400);
      }
    }

    // Register new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = tokenService.generateVerificationCode();

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      country,
      verificationCode: {
        code: verificationCode,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
      },
    });

    await emailService.sendVerificationCode(email, verificationCode);
    return { message: "User registered successfully. Check email for verification code." };
  }

  /**
   * Verify user's email using code
   */
  async verifyEmail(email, code) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError("User not found", 404);

    if (!user.verificationCode || user.verificationCode.code !== code) {
      throw new ApiError("Invalid verification code", 400);
    }

    if (Date.now() > user.verificationCode.expiresAt) {
      throw new ApiError("Verification code expired. Please register again.", 400);
    }

    user.isVerified = true;
    user.verificationCode = { code: null, expiresAt: null };
    await user.save();
    return { message: "Email verified successfully. You can now log in." };
  }

  /**
   * Login (works for User/Admin/Super Admin)
   */
  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError("Invalid email or password", 401);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new ApiError("Invalid email or password", 401);

    if (!user.isVerified && user.role === "USER")
      throw new ApiError("Email not verified. Please verify before logging in.", 403);

    const accessToken = tokenService.generateAccessToken({
      id: user._id,
      role: user.role,
    });

    return { token: accessToken, user: { id: user._id, role: user.role, email: user.email } };
  }

  /**
   * Forgot Password: Send reset code
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError("User not found", 404);

    const resetCode = tokenService.generateVerificationCode();
    user.passwordResetCode = {
      code: resetCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
    };
    await user.save();

    await emailService.sendPasswordResetCode(email, resetCode);
    return { message: "Password reset code sent to email." };
  }

  /**
   * Reset Password with code
   */
  async resetPassword(email, code, newPassword) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError("User not found", 404);

    if (
      !user.passwordResetCode ||
      user.passwordResetCode.code !== code ||
      Date.now() > user.passwordResetCode.expiresAt
    ) {
      throw new ApiError("Invalid or expired reset code.", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetCode = { code: null, expiresAt: null };
    await user.save();

    return { message: "Password reset successfully. You can now log in." };
  }


  /**
 * Resend verification code for unverified users
 */
async resendVerification(email) {
    const user = await User.findOne({ email });
  
    if (!user) throw new ApiError("User not found.", 404);
    if (user.isVerified) throw new ApiError("Email is already verified.", 400);
  
    // Generate a new code if expired or missing
    let verificationCode = user.verificationCode?.code;
    const isExpired =
      !user.verificationCode?.expiresAt || Date.now() > user.verificationCode.expiresAt;
  
    if (isExpired || !verificationCode) {
      verificationCode = tokenService.generateVerificationCode();
      user.verificationCode = {
        code: verificationCode,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
      };
      await user.save();
    }
  
    await emailService.sendVerificationCode(email, verificationCode);
    return { message: "A new verification code has been sent to your email." };
  }

  /**
   * Super Admin creates Admin
   */
  async createAdmin(superAdminId, { firstName, lastName, email, password }) {
    const superAdmin = await User.findById(superAdminId);
    if (!superAdmin || superAdmin.role !== "SUPER_ADMIN") {
      throw new ApiError("Not authorized. Only Super Admin can create admins.", 403);
    }

    const existing = await User.findOne({ email });
    if (existing) throw new ApiError("Email already in use", 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true, // Admin is verified by default
    });

    return { message: "Admin created successfully.", admin };
  }
}

module.exports = new AuthService();

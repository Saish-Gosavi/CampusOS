import crypto from "crypto";
import bcrypt from "bcryptjs";
import { AuthRepository } from "../repository/auth.repository.js";
import { jwtConfig } from "../../../config/jwt.js";
import AppError from "../../../utils/AppError.js";

export class AuthService {
  // ─── Login ───────────────────────────────────────────────
  static async login({ email, password }) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.status !== "active") {
      throw new AppError("Your account has been suspended", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = jwtConfig.generateToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
      hostelId: user.hostelId,
    });
    const refreshToken = jwtConfig.generateRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
        hostelId: user.hostelId,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  // ─── Refresh Token ──────────────────────────────────────
  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    let decoded;
    try {
      decoded = jwtConfig.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await AuthRepository.findUserById(decoded.id);
    if (!user || user.status !== "active") {
      throw new AppError("Invalid refresh session", 401);
    }

    const newAccessToken = jwtConfig.generateToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
      hostelId: user.hostelId,
    });

    return { accessToken: newAccessToken };
  }

  // ─── Change Password (Authenticated) ───────────────────
  static async changePassword(userId, { currentPassword, newPassword }) {
    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError("Incorrect current password", 400);
    }

    if (currentPassword === newPassword) {
      throw new AppError("New password must be different from current password", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await AuthRepository.updatePassword(userId, hashedPassword);
    return { message: "Password changed successfully" };
  }

  // ─── Forgot Password ───────────────────────────────────
  static async forgotPassword({ email }) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      // Return success even if user not found (security: don't reveal email existence)
      return { message: "If the email exists, a reset token has been generated" };
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await AuthRepository.setResetToken(user.id, resetToken, resetTokenExpiry);

    // In production, send this token via email.
    // For development, return the token in the response.
    return {
      message: "Password reset token generated successfully",
      resetToken, // Remove this in production — send via email instead
    };
  }

  // ─── Reset Password ────────────────────────────────────
  static async resetPassword({ token, password }) {
    if (!token) {
      throw new AppError("Reset token is required", 400);
    }

    const user = await AuthRepository.findUserByResetToken(token);
    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await AuthRepository.updatePassword(user.id, hashedPassword);
    return { message: "Password has been reset successfully" };
  }

  // ─── Get Current User (me) ─────────────────────────────
  static async getMe(userId) {
    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      hostelId: user.hostelId,
      status: user.status,
      createdAt: user.createdAt,
    };
  }
}

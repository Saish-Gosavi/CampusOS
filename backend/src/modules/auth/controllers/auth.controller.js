import { AuthService } from "../services/auth.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";
import { AuditLogService } from "../../../core/audit/auditLog.service.js";

export class AuthController {
  // POST /api/auth/login
  static async login(req, res, next) {
    try {
      const data = await AuthService.login(req.body);
      await AuditLogService.logAction({
        userId: data?.user?.id,
        module: "System",
        action: "User Login",
        description: `User ${data?.user?.email} logged into system portal`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, data, "Login successful");
    } catch (error) {
      await AuditLogService.logAction({
        userId: null,
        module: "System",
        action: "User Login",
        description: `Failed login attempt for ${req.body?.email || "unknown"}`,
        status: "Failed",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      next(error);
    }
  }

  // POST /api/auth/refresh
  static async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const data = await AuthService.refresh(refreshToken);
      return apiResponse.success(res, data, "Token refreshed successfully");
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/logout
  static async logout(req, res, next) {
    try {
      // Stateless JWT — client simply discards the token
      return apiResponse.success(res, null, "Logout successful");
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/change-password  (Authenticated)
  static async changePassword(req, res, next) {
    try {
      const data = await AuthService.changePassword(req.user.id, req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Change Password",
        description: `User ${req.user?.id} changed password`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, data, "Password changed successfully");
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/forgot-password
  static async forgotPassword(req, res, next) {
    try {
      const data = await AuthService.forgotPassword(req.body);
      return apiResponse.success(res, data, data.message);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/reset-password
  static async resetPassword(req, res, next) {
    try {
      const data = await AuthService.resetPassword(req.body);
      return apiResponse.success(res, data, data.message);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/me  (Authenticated)
  static async me(req, res, next) {
    try {
      const data = await AuthService.getMe(req.user.id);
      return apiResponse.success(res, data, "Profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

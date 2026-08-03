import { UsersService } from "../services/users.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";
import { AuditLogService } from "../../../core/audit/auditLog.service.js";

export class UsersController {
  static async getProfile(req, res, next) {
    try {
      const user = await UsersService.getProfile(req.user.id);
      return apiResponse.success(res, user, "Profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const user = await UsersService.updateProfile(req.user.id, req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Update Profile",
        description: `User ${req.user?.id} updated their profile`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, user, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await UsersService.getAllUsers();
      return apiResponse.success(res, users, "Users list retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const user = await UsersService.createUser(req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Admins",
        action: "Create User",
        description: `Created user ${user.email || req.body.email}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: user,
      });
      return apiResponse.success(res, user, "User created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      await UsersService.deleteUser(req.params.id);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Admins",
        action: "Delete User",
        description: `Deleted user ID ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

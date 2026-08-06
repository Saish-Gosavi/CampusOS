import { RolesService } from "../services/roles.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";
import { AuditLogService } from "../../../core/audit/auditLog.service.js";

export class RolesController {
  static async getAllRoles(req, res, next) {
    try {
      const roles = await RolesService.getAllRoles();
      return apiResponse.success(res, roles, "Roles list retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAllPermissions(req, res, next) {
    try {
      const permissions = await RolesService.getAllPermissions();
      return apiResponse.success(res, permissions, "Permissions list retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getRoleById(req, res, next) {
    try {
      const role = await RolesService.getRoleById(req.params.id);
      return apiResponse.success(res, role, "Role retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createRole(req, res, next) {
    try {
      const userContext = { id: req.user?.id, ipAddress: req.ip };
      const role = await RolesService.createRole(req.body, userContext);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Create Role",
        description: `Created new system role: ${role.name || req.body.name}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: role,
      });
      return apiResponse.success(res, role, "Role created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req, res, next) {
    try {
      const userContext = { id: req.user?.id, ipAddress: req.ip };
      const role = await RolesService.updateRole(req.params.id, req.body, userContext);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Update Role",
        description: `Updated role permissions for role ID: ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: role,
      });
      return apiResponse.success(res, role, "Role updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async deleteRole(req, res, next) {
    try {
      const userContext = { id: req.user?.id, ipAddress: req.ip };
      const role = await RolesService.deleteRole(req.params.id, userContext);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Delete Role",
        description: `Deleted role ID: ${req.params.id}`,
        status: "Warning",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, null, "Role deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

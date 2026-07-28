import { RolesService } from "../services/roles.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";

export class RolesController {
  static async getAllRoles(req, res, next) {
    try {
      const roles = await RolesService.getAllRoles();
      return apiResponse.success(res, roles, "Roles list retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getRolesAndPermissions(req, res, next) {
    try {
      const rolesAndPermissions = await RolesService.getRolesAndPermissions();
      return apiResponse.success(
        res,
        rolesAndPermissions,
        "Roles and permissions retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  static async createRoleAndPermissions(req, res, next) {
    try {
      const { name, description, permissionIds } = req.body;
      const userContext = {
        userId: req.user ? req.user.id : null,
        ipAddress: req.ip || req.headers["x-forwarded-for"],
      };

      const newRole = await RolesService.createRoleAndPermissions(
        { name, description, permissionIds },
        userContext
      );

      return apiResponse.created(
        res,
        newRole,
        "Role and permissions created successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}


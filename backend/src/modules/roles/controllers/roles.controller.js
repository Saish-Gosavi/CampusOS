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

  static async createRole(req, res, next) {
    try {
      const userContext = { id: req.user?.id, ipAddress: req.ip };
      const role = await RolesService.createRole(req.body, userContext);
      return apiResponse.created(res, role, "Role created successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req, res, next) {
    try {
      const userContext = { id: req.user?.id, ipAddress: req.ip };
      const role = await RolesService.updateRole(req.params.id, req.body, userContext);
      return apiResponse.success(res, role, "Role updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async deleteRole(req, res, next) {
    try {
      const userContext = { id: req.user?.id, ipAddress: req.ip };
      const role = await RolesService.deleteRole(req.params.id, userContext);
      return apiResponse.success(res, null, "Role deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

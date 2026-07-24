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
}

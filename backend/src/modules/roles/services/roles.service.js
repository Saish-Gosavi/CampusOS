import { RolesRepository } from "../repository/roles.repository.js";
import AppError from "../../../utils/AppError.js";

export class RolesService {
  static async getAllRoles() {
    return RolesRepository.findAll();
  }

  static async getRolesAndPermissions() {
    const roles = await RolesRepository.findAll();
    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p) => p.permission),
    }));
  }

  static async createRoleAndPermissions({ name, description, permissionIds }, userContext = {}) {
    if (!name) {
      throw new AppError("Role name is required", 400);
    }

    const createdRole = await RolesRepository.createRoleWithPermissions({
      name,
      description,
      permissionIds,
    });

    if (userContext.userId) {
      await RolesRepository.createAuditLog({
        userId: userContext.userId,
        action: "CREATE_ROLE_AND_PERMISSIONS",
        details: JSON.stringify({ roleId: createdRole.id, name: createdRole.name, permissionIds }),
        ipAddress: userContext.ipAddress || null,
      });
    }

    return {
      id: createdRole.id,
      name: createdRole.name,
      description: createdRole.description,
      permissions: createdRole.permissions.map((p) => p.permission),
    };
  }
}


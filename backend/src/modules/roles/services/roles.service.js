import { RolesRepository } from "../repository/roles.repository.js";
import AppError from "../../../utils/AppError.js";

export class RolesService {
  static async getAllRoles() {
    return RolesRepository.findAll();
  }

  static async getRoleById(id) {
    const role = await RolesRepository.findById(id);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    return role;
  }

  static async createRole(data, userContext) {
    if (!data.name) {
      throw new AppError("Role name is required", 400);
    }

    const existingRole = await RolesRepository.findByName(data.name.trim());
    if (existingRole) {
      throw new AppError("Role with this name already exists", 400);
    }

    if (data.permissionIds && data.permissionIds.length > 0) {
      const uniqueIds = [...new Set(data.permissionIds.map(Number))];
      const validCount = await RolesRepository.countPermissionsByIds(uniqueIds);
      if (validCount !== uniqueIds.length) {
        throw new AppError("One or more specified permission IDs do not exist", 400);
      }
    }

    return RolesRepository.createRoleWithPermissions(data, userContext?.id, userContext?.ipAddress);
  }

  static async updateRole(id, data, userContext) {
    const role = await RolesRepository.findById(id);
    if (!role) {
      throw new AppError("Role not found", 404);
    }

    if (role.name.toLowerCase() === "superadmin") {
      throw new AppError("Cannot modify the superadmin role", 400);
    }

    if (data.name) {
      const existingRole = await RolesRepository.findByName(data.name.trim());
      if (existingRole && existingRole.id !== Number(id)) {
        throw new AppError("Role with this name already exists", 400);
      }
    }

    if (data.permissionIds && data.permissionIds.length > 0) {
      const uniqueIds = [...new Set(data.permissionIds.map(Number))];
      const validCount = await RolesRepository.countPermissionsByIds(uniqueIds);
      if (validCount !== uniqueIds.length) {
        throw new AppError("One or more specified permission IDs do not exist", 400);
      }
    }

    return RolesRepository.updateRoleWithPermissions(id, data, userContext?.id, userContext?.ipAddress);
  }

  static async deleteRole(id, userContext) {
    const role = await RolesRepository.findById(id);
    if (!role) {
      throw new AppError("Role not found", 404);
    }

    if (role.name.toLowerCase() === "superadmin") {
      throw new AppError("Cannot delete the superadmin role", 400);
    }

    return RolesRepository.deleteRole(id, userContext?.id, userContext?.ipAddress);
  }
}


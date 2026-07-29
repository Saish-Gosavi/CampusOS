import { RolesRepository } from "../repository/roles.repository.js";

export class RolesService {
  static async getAllRoles() {
    return RolesRepository.findAll();
  }

  static async getRoleById(id) {
    const role = await RolesRepository.findById(id);
    if (!role) throw new Error("Role not found");
    return role;
  }

  static async createRole(data, userContext) {
    if (!data.name) throw new Error("Role name is required");
    return RolesRepository.createRoleWithPermissions(data, userContext?.id, userContext?.ipAddress);
  }

  static async updateRole(id, data, userContext) {
    const role = await RolesRepository.findById(id);
    if (!role) throw new Error("Role not found");
    if (role.name.toLowerCase() === "superadmin") {
      throw new Error("Cannot modify the superadmin role");
    }
    return RolesRepository.updateRoleWithPermissions(id, data, userContext?.id, userContext?.ipAddress);
  }

  static async deleteRole(id, userContext) {
    const role = await RolesRepository.findById(id);
    if (!role) throw new Error("Role not found");
    if (role.name.toLowerCase() === "superadmin") {
      throw new Error("Cannot delete the superadmin role");
    }
    return RolesRepository.deleteRole(id, userContext?.id, userContext?.ipAddress);
  }
}

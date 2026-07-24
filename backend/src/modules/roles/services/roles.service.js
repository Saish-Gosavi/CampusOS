import { RolesRepository } from "../repository/roles.repository.js";

export class RolesService {
  static async getAllRoles() {
    return RolesRepository.findAll();
  }
}

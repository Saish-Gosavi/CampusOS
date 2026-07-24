import { prisma } from "../../../config/prisma.js";

export class RolesRepository {
  static async findAll() {
    return prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
    });
  }
}

import { prisma } from "../../../config/prisma.js";

export class RolesRepository {
  static async findAll() {
    return prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
    });
  }

  static async createRoleWithPermissions({ name, description, permissionIds = [] }) {
    return prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create: permissionIds.map((id) => ({
            permission: { connect: { id } },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  static async createAuditLog({ userId, action, details, ipAddress }) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
      },
    });
  }
}


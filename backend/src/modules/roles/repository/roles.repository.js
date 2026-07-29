import { prisma } from "../../../config/prisma.js";

export class RolesRepository {
  static async findAll() {
    return prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
    });
  }

  static async findById(id) {
    return prisma.role.findUnique({
      where: { id: Number(id) },
      include: { permissions: { include: { permission: true } } },
    });
  }

  static async createRoleWithPermissions({ name, description, permissionIds }, userId, ipAddress) {
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: {
          name,
          description,
          permissions: {
            create: permissionIds.map((permId) => ({
              permission: { connect: { id: Number(permId) } },
            })),
          },
        },
        include: { permissions: { include: { permission: true } } },
      });

      if (userId) {
        await tx.auditLog.create({
          data: {
            userId: Number(userId),
            action: "CREATE_ROLE",
            details: `Created role: ${name}`,
            ipAddress,
          },
        });
      }
      return role;
    });
  }

  static async updateRoleWithPermissions(id, { name, description, permissionIds }, userId, ipAddress) {
    return prisma.$transaction(async (tx) => {
      // Delete existing permissions mapping
      await tx.rolesOnPermissions.deleteMany({
        where: { roleId: Number(id) },
      });

      const role = await tx.role.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          permissions: {
            create: (permissionIds || []).map((permId) => ({
              permission: { connect: { id: Number(permId) } },
            })),
          },
        },
        include: { permissions: { include: { permission: true } } },
      });

      if (userId) {
        await tx.auditLog.create({
          data: {
            userId: Number(userId),
            action: "UPDATE_ROLE",
            details: `Updated role: ${role.name}`,  // use role.name from DB result, not destructured name
            ipAddress,
          },
        });
      }
      return role;
    });
  }


  static async deleteRole(id, userId, ipAddress) {
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.delete({
        where: { id: Number(id) },
      });

      if (userId) {
        await tx.auditLog.create({
          data: {
            userId: Number(userId),
            action: "DELETE_ROLE",
            details: `Deleted role: ${role.name}`,
            ipAddress,
          },
        });
      }
      return role;
    });
  }
}

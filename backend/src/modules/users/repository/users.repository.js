import { prisma } from "../../../config/prisma.js";

export class UsersRepository {
  static async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        studentProfile: true,
        wardenProfile: true,
        securityProfile: true,
      },
    });
  }

  static async updateProfile(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async findAll() {
    return prisma.user.findMany({
      include: { role: true },
    });
  }

  static async create(data) {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  }

  static async delete(id) {
    const userId = Number(id);
    if (!userId || isNaN(userId)) return null;

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) return null;

    await prisma.$transaction([
      prisma.student.deleteMany({ where: { userId } }),
      prisma.warden.deleteMany({ where: { userId } }),
      prisma.securityStaff.deleteMany({ where: { userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.auditLog.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return existing;
  }
}

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
    return prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}

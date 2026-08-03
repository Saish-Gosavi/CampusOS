import { prisma } from "../../../config/prisma.js";

export class AuthRepository {
  static async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true, hostel: true },
    });
  }

  static async findUserById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true, hostel: true },
    });
  }

  static async findUserByResetToken(token) {
    return prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
      include: { role: true },
    });
  }

  static async updatePassword(id, hashedPassword) {
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  static async setResetToken(id, token, expiry) {
    return prisma.user.update({
      where: { id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });
  }
}

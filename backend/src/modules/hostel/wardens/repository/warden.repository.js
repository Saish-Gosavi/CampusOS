import { prisma } from "../../../../config/prisma.js";

export class WardenRepository {
  static async findAll(hostelId) {
    const where = hostelId ? { hostelId: Number(hostelId) } : {};
    return prisma.warden.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, status: true, role: true }
        },
        hostel: {
          select: { id: true, name: true, city: true }
        }
      }
    });
  }

  static async findById(id) {
    return prisma.warden.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: { id: true, email: true, status: true, role: true }
        },
        hostel: {
          select: { id: true, name: true, city: true }
        }
      }
    });
  }

  static async delete(id) {
    const wardenId = Number(id);
    const existing = await prisma.warden.findUnique({ where: { id: wardenId } });
    if (!existing) return null;

    // Delete user (cascade will remove warden profile)
    await prisma.user.delete({ where: { id: existing.userId } });
    return existing;
  }
}

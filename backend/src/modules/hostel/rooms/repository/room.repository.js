import { prisma } from "../../../../config/prisma.js";

export class RoomRepository {
  static async findAll() {
    return prisma.room.findMany({
      include: { floor: true, beds: true },
    });
  }

  static async findById(id) {
    return prisma.room.findUnique({
      where: { id },
      include: { floor: true, beds: true },
    });
  }

  static async create(data) {
    return prisma.room.create({
      data,
    });
  }

  static async update(id, data) {
    return prisma.room.update({
      where: { id },
      data,
    });
  }

  static async delete(id) {
    return prisma.room.delete({
      where: { id },
    });
  }
}

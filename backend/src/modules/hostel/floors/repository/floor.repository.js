import { prisma } from "../../../../config/prisma.js";

export class FloorRepository {
  static async findAll() {
    return prisma.floor.findMany();
  }

  static async findById(id) {
    return prisma.floor.findUnique({
      where: { id: Number(id) }
    });
  }

  static async create(data) {
    return prisma.floor.create({
      data
    });
  }

  static async update(id, data) {
    return prisma.floor.update({
      where: { id: Number(id) },
      data
    });
  }

  static async delete(id) {
    return prisma.floor.delete({
      where: { id: Number(id) }
    });
  }
}

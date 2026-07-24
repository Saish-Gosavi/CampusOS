import { prisma } from "../../../../config/prisma.js";

export class FurnitureRepository {
  static async findAll() {
    return prisma.furniture.findMany();
  }

  static async findById(id) {
    return prisma.furniture.findUnique({
      where: { id: Number(id) },
    });
  }

  static async create(data) {
    return prisma.furniture.create({
      data,
    });
  }

  static async update(id, data) {
    return prisma.furniture.update({
      where: { id: Number(id) },
      data,
    });
  }

  static async delete(id) {
    return prisma.furniture.delete({
      where: { id: Number(id) },
    });
  }
}

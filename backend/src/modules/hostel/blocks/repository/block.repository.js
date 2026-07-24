import { prisma } from "../../../../config/prisma.js";

export class BlockRepository {
  static async findAll() {
    return prisma.block.findMany();
  }

  static async findById(id) {
    return prisma.block.findUnique({
      where: { id: Number(id) }
    });
  }

  static async create(data) {
    return prisma.block.create({
      data
    });
  }

  static async update(id, data) {
    return prisma.block.update({
      where: { id: Number(id) },
      data
    });
  }

  static async delete(id) {
    return prisma.block.delete({
      where: { id: Number(id) }
    });
  }
}

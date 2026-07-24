import { prisma } from "../../../../config/prisma.js";

export class FeeRepository {
  static async findAll() {
    return prisma.fee.findMany();
  }

  static async findById(id) {
    return prisma.fee.findUnique({
      where: { id: Number(id) }
    });
  }

  static async create(data) {
    return prisma.fee.create({
      data
    });
  }

  static async update(id, data) {
    return prisma.fee.update({
      where: { id: Number(id) },
      data
    });
  }

  static async delete(id) {
    return prisma.fee.delete({
      where: { id: Number(id) }
    });
  }
}

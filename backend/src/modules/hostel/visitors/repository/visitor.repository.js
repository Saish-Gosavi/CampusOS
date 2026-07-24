import { prisma } from "../../../../config/prisma.js";

export class VisitorRepository {
  static async findAll() {
    return prisma.visitor.findMany();
  }

  static async findById(id) {
    return prisma.visitor.findUnique({
      where: { id: Number(id) }
    });
  }

  static async create(data) {
    return prisma.visitor.create({
      data
    });
  }

  static async update(id, data) {
    return prisma.visitor.update({
      where: { id: Number(id) },
      data
    });
  }

  static async delete(id) {
    return prisma.visitor.delete({
      where: { id: Number(id) }
    });
  }
}

import { prisma } from "../../../../config/prisma.js";

export class AllocationRepository {
  static async findAll() {
    return prisma.allocation.findMany();
  }

  static async findById(id) {
    return prisma.allocation.findUnique({
      where: { id: Number(id) }
    });
  }

  static async create(data) {
    return prisma.allocation.create({
      data
    });
  }

  static async update(id, data) {
    return prisma.allocation.update({
      where: { id: Number(id) },
      data
    });
  }

  static async delete(id) {
    return prisma.allocation.delete({
      where: { id: Number(id) }
    });
  }
}

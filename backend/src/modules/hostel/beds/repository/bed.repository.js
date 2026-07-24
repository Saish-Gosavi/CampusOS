import { prisma } from "../../../../config/prisma.js";

export class BedRepository {
  static async findAll() {
    return prisma.bed.findMany();
  }

  static async findById(id) {
    return prisma.bed.findUnique({
      where: { id: Number(id) }
    });
  }

  static async create(data) {
    return prisma.bed.create({
      data
    });
  }

  static async update(id, data) {
    return prisma.bed.update({
      where: { id: Number(id) },
      data
    });
  }

  static async delete(id) {
    return prisma.bed.delete({
      where: { id: Number(id) }
    });
  }
}

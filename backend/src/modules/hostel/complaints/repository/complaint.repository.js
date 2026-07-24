import { prisma } from "../../../../config/prisma.js";

export class ComplaintRepository {
  static async findAll() {
    return prisma.complaint.findMany();
  }

  static async findById(id) {
    return prisma.complaint.findUnique({
      where: { id: Number(id) }
    });
  }

  static async create(data) {
    return prisma.complaint.create({
      data
    });
  }

  static async update(id, data) {
    return prisma.complaint.update({
      where: { id: Number(id) },
      data
    });
  }

  static async delete(id) {
    return prisma.complaint.delete({
      where: { id: Number(id) }
    });
  }
}

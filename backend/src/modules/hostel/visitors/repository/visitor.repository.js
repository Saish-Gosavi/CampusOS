import { prisma } from "../../../../config/prisma.js";

export class VisitorRepository {
  static async findAll() {
    return prisma.visitor.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /** Pending requests awaiting warden action */
  static async findPending() {
    return prisma.visitor.findMany({
      where: { status: "Pending" },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Requests already processed by the warden (Approved or Rejected) */
  static async findProcessed() {
    return prisma.visitor.findMany({
      where: { status: { in: ["Approved", "Rejected", "Checked-In", "Checked-Out"] } },
      orderBy: { updatedAt: "desc" },
    });
  }

  static async findById(id) {
    return prisma.visitor.findUnique({
      where: { id: Number(id) },
    });
  }

  static async create(data) {
    return prisma.visitor.create({ data });
  }

  static async update(id, data) {
    return prisma.visitor.update({
      where: { id: Number(id) },
      data,
    });
  }

  static async delete(id) {
    return prisma.visitor.delete({
      where: { id: Number(id) },
    });
  }
}

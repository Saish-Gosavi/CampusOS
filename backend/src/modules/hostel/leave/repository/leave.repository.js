import { prisma } from "../../../../config/prisma.js";

export class LeaveRepository {
  static async findAll() {
    return prisma.leaveRequest.findMany();
  }

  static async findById(id) {
    return prisma.leaveRequest.findUnique({
      where: { id: Number(id) },
    });
  }

  static async create(data) {
    return prisma.leaveRequest.create({
      data,
    });
  }

  static async update(id, data) {
    return prisma.leaveRequest.update({
      where: { id: Number(id) },
      data,
    });
  }

  static async delete(id) {
    return prisma.leaveRequest.delete({
      where: { id: Number(id) },
    });
  }
}

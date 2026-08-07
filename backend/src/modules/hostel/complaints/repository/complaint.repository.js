import { prisma } from "../../../../config/prisma.js";

export class ComplaintRepository {
  static async findAll(where = {}) {
    return prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            id: true,
            collegeId: true,
            fullName: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            allocations: {
              where: { status: "active" },
              include: {
                bed: {
                  include: {
                    room: {
                      include: {
                        floor: {
                          include: {
                            block: {
                              include: {
                                hostel: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  static async findById(id) {
    return prisma.complaint.findUnique({
      where: { id: Number(id) },
      include: {
        student: {
          select: {
            id: true,
            collegeId: true,
            fullName: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  static async create(data) {
    return prisma.complaint.create({
      data,
      include: {
        student: {
          select: {
            id: true,
            collegeId: true,
            fullName: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  static async update(id, data) {
    return prisma.complaint.update({
      where: { id: Number(id) },
      data,
      include: {
        student: {
          select: {
            id: true,
            collegeId: true,
            fullName: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  static async delete(id) {
    return prisma.complaint.delete({
      where: { id: Number(id) },
    });
  }
}


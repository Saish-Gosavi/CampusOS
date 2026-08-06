import { prisma } from "../../../../config/prisma.js";

export class RoomAllotmentLetterRepository {
  static async findAll() {
    return prisma.roomAllotmentLetter.findMany({
      include: {
        generatedBy: { select: { name: true } },
        letterRequest: {
          include: {
            approvedBy: { select: { name: true } },
            hostel: true,
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        allocation: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
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
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id) {
    return prisma.roomAllotmentLetter.findUnique({
      where: { id: Number(id) },
      include: {
        generatedBy: { select: { name: true } },
        letterRequest: {
          include: {
            approvedBy: { select: { name: true } },
            hostel: true,
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        allocation: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
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
    });
  }

  static async findByAllocationId(allocationId) {
    return prisma.roomAllotmentLetter.findUnique({
      where: { allocationId: Number(allocationId) },
    });
  }

  static async create(data) {
    return prisma.roomAllotmentLetter.create({
      data,
      include: {
        allocation: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  static async update(id, data) {
    return prisma.roomAllotmentLetter.update({
      where: { id: Number(id) },
      data,
    });
  }

  static async delete(id) {
    return prisma.roomAllotmentLetter.delete({
      where: { id: Number(id) },
    });
  }
}

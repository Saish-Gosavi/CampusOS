import { prisma } from "../../../../config/prisma.js";

export class InspectionRepository {
  static async findAll({ search, status, hostelId } = {}) {
    const where = {};

    if (status && status !== "All") {
      where.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { inspectionCode: { contains: q } },
        { room: { number: { contains: q } } },
        { remarks: { contains: q } },
      ];
    }

    if (hostelId) {
      where.room = {
        ...where.room,
        floor: {
          block: {
            hostelId: Number(hostelId),
          },
        },
      };
    }

    return prisma.roomInspection.findMany({
      where,
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
        inspectedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });
  }

  static async findById(id) {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;

    return prisma.roomInspection.findUnique({
      where: { id: numId },
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
            beds: {
              include: {
                allocations: {
                  where: { status: "active" },
                  include: { student: true },
                },
              },
            },
            furniture: true,
          },
        },
        inspectedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async create(data) {
    const inspectionCode = data.inspectionCode || `INS-${Date.now().toString().slice(-6)}`;

    return prisma.roomInspection.create({
      data: {
        inspectionCode,
        roomId: Number(data.roomId),
        inspectedById: Number(data.inspectedById),
        cleanlinessScore: data.cleanlinessScore || "Good",
        status: data.status || "Pass",
        furnitureCondition: data.furnitureCondition || "Good",
        remarks: data.remarks || null,
        actionRequired: data.actionRequired || null,
      },
      include: {
        room: {
          include: {
            floor: {
              include: {
                block: true,
              },
            },
          },
        },
        inspectedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}

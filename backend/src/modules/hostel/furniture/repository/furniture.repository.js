import { prisma } from "../../../../config/prisma.js";

export class FurnitureRepository {
  static async findAll({ search, condition, category, hostelId } = {}) {
    const where = {};

    if (condition && condition !== "All") {
      where.condition = condition;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { assetCode: { contains: q } },
        { room: { number: { contains: q } } },
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

    return prisma.furniture.findMany({
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
      },
      orderBy: { id: "desc" },
    });
  }

  static async findById(id) {
    const numId = Number(id);
    if (!numId || isNaN(numId)) return null;

    return prisma.furniture.findUnique({
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
          },
        },
      },
    });
  }

  static async create(data) {
    const assetCode = data.assetCode || `FUR-${Date.now().toString().slice(-6)}`;
    return prisma.furniture.create({
      data: {
        assetCode,
        name: data.name,
        category: data.category || "General",
        condition: data.condition || "Good",
        quantity: Number(data.quantity) || 1,
        roomId: data.roomId ? Number(data.roomId) : null,
        remarks: data.remarks || null,
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
      },
    });
  }

  static async update(id, data) {
    const numId = Number(id);
    return prisma.furniture.update({
      where: { id: numId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.assetCode && { assetCode: data.assetCode }),
        ...(data.category && { category: data.category }),
        ...(data.condition && { condition: data.condition }),
        ...(data.quantity !== undefined && { quantity: Number(data.quantity) }),
        ...(data.roomId !== undefined && { roomId: data.roomId ? Number(data.roomId) : null }),
        ...(data.remarks !== undefined && { remarks: data.remarks }),
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
      },
    });
  }

  static async delete(id) {
    const numId = Number(id);
    return prisma.furniture.delete({
      where: { id: numId },
    });
  }
}

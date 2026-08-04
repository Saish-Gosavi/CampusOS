import { prisma } from "../../../../config/prisma.js";

export class BlockRepository {
  static async findAll(hostelId) {
    const where = hostelId ? { hostelId: Number(hostelId) } : {};
    return prisma.block.findMany({
      where,
      include: {
        floors: {
          include: {
            rooms: {
              include: {
                beds: {
                  include: {
                    allocations: {
                      where: { status: "active" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  static async findById(id) {
    return prisma.block.findUnique({
      where: { id: Number(id) },
      include: {
        floors: {
          include: {
            rooms: {
              include: {
                beds: {
                  include: {
                    allocations: {
                      where: { status: "active" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  static async create(data) {
    return prisma.block.create({
      data: {
        name: data.name,
        hostelId: Number(data.hostelId)
      }
    });
  }

  static async update(id, data) {
    return prisma.block.update({
      where: { id: Number(id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.hostelId && { hostelId: Number(data.hostelId) })
      }
    });
  }

  static async delete(id) {
    return prisma.block.delete({
      where: { id: Number(id) }
    });
  }
}

import { prisma } from "../../../../config/prisma.js";

export class FloorRepository {
  static async findAll(blockId) {
    const where = blockId ? { blockId: Number(blockId) } : {};
    return prisma.floor.findMany({
      where,
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
    });
  }

  static async findById(id) {
    return prisma.floor.findUnique({
      where: { id: Number(id) },
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
    });
  }

  static async create(data) {
    return prisma.floor.create({
      data: {
        number: Number(data.number),
        blockId: Number(data.blockId)
      }
    });
  }

  static async update(id, data) {
    return prisma.floor.update({
      where: { id: Number(id) },
      data: {
        ...(data.number !== undefined && { number: Number(data.number) }),
        ...(data.blockId && { blockId: Number(data.blockId) })
      }
    });
  }

  static async delete(id) {
    return prisma.floor.delete({
      where: { id: Number(id) }
    });
  }
}

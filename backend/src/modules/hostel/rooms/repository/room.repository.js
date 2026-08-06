import { prisma } from "../../../../config/prisma.js";

export class RoomRepository {
  static async findAll(floorId) {
    const where = floorId ? { floorId: Number(floorId) } : {};
    return prisma.room.findMany({
      where,
      include: {
        floor: {
          include: {
            block: true
          }
        },
        beds: {
          include: {
            allocations: {
              where: { status: "active" },
              include: { student: true }
            }
          }
        },
        furniture: true
      }
    });
  }

  static async findById(id) {
    return prisma.room.findUnique({
      where: { id: Number(id) },
      include: {
        floor: {
          include: {
            block: true
          }
        },
        beds: {
          include: {
            allocations: {
              where: { status: "active" },
              include: { student: true }
            }
          }
        },
        furniture: true
      }
    });
  }

  static async create(data) {
    const capacity = Number(data.capacity || 1);
    const room = await prisma.room.create({
      data: {
        number: String(data.number),
        floorId: Number(data.floorId),
        capacity,
        rent: data.rent ? Number(data.rent) : 0,
      }
    });

    // Auto-create beds for this room
    const bedData = Array.from({ length: capacity }, (_, i) => ({
      number: `Bed ${i + 1}`,
      roomId: room.id,
    }));
    await prisma.bed.createMany({ data: bedData });

    return this.findById(room.id);
  }

  static async update(id, data) {
    const roomId = Number(id);
    const updated = await prisma.room.update({
      where: { id: roomId },
      data: {
        ...(data.number && { number: String(data.number) }),
        ...(data.floorId && { floorId: Number(data.floorId) }),
        ...(data.capacity && { capacity: Number(data.capacity) }),
        ...(data.rent !== undefined && { rent: Number(data.rent) }),
      }
    });

    // If capacity increased, ensure sufficient beds exist
    if (data.capacity) {
      const existingBeds = await prisma.bed.findMany({ where: { roomId } });
      const targetCap = Number(data.capacity);
      if (targetCap > existingBeds.length) {
        const extraBeds = Array.from({ length: targetCap - existingBeds.length }, (_, i) => ({
          number: `Bed ${existingBeds.length + i + 1}`,
          roomId,
        }));
        await prisma.bed.createMany({ data: extraBeds });
      }
    }

    return this.findById(roomId);
  }

  static async delete(id) {
    return prisma.room.delete({
      where: { id: Number(id) }
    });
  }
}

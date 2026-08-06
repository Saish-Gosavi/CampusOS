import { prisma } from "../../../config/prisma.js";
import AppError from "../../../utils/AppError.js";

export class StaffService {
  static async getStaffByAdmin(hostelId) {
    if (!hostelId) {
      throw new AppError("Admin must be associated with a hostel to manage staff", 400);
    }
    return prisma.staff.findMany({
      where: { hostelId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createStaff(hostelId, data) {
    if (!hostelId) {
      throw new AppError("Admin must be associated with a hostel to create staff", 400);
    }
    if (!data.name || !data.designation) {
      throw new AppError("Name and designation are required", 400);
    }
    return prisma.staff.create({
      data: {
        name: data.name,
        phone: data.phone || null,
        designation: data.designation,
        hostelId,
        status: data.status || "active",
      },
    });
  }

  static async updateStaff(id, data) {
    const existing = await prisma.staff.findUnique({ where: { id: Number(id) } });
    if (!existing) throw new AppError("Staff member not found", 404);

    return prisma.staff.update({
      where: { id: Number(id) },
      data: {
        name: data.name ?? existing.name,
        phone: data.phone ?? existing.phone,
        designation: data.designation ?? existing.designation,
        status: data.status ?? existing.status,
      },
    });
  }

  static async deleteStaff(id) {
    const existing = await prisma.staff.findUnique({ where: { id: Number(id) } });
    if (!existing) throw new AppError("Staff member not found", 404);

    return prisma.staff.delete({ where: { id: Number(id) } });
  }

  static async getAttendance(staffId) {
    return prisma.staffAttendance.findMany({
      where: { staffId: Number(staffId) },
      orderBy: { date: "desc" },
    });
  }
}

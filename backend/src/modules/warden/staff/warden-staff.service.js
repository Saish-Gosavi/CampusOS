import { prisma } from "../../../config/prisma.js";
import AppError from "../../../utils/AppError.js";

export class WardenStaffService {
  static async getStaffByWarden(hostelId) {
    const where = {};
    if (hostelId && !isNaN(Number(hostelId))) {
      where.hostelId = Number(hostelId);
    }

    const staffList = await prisma.staff.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return staffList;
  }

  static async createStaff(hostelId, data) {
    if (!hostelId) {
      throw new AppError("Hostel ID is required", 400);
    }

    const newStaff = await prisma.staff.create({
      data: {
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        designation: data.designation,
        status: data.status || "active",
        hostelId: parseInt(hostelId),
      },
    });

    return newStaff;
  }

  static async updateStaff(id, data) {
    const existingStaff = await prisma.staff.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingStaff) {
      throw new AppError("Staff not found", 404);
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        designation: data.designation,
        status: data.status,
      },
    });

    return updatedStaff;
  }

  static async deleteStaff(id) {
    const existingStaff = await prisma.staff.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingStaff) {
      throw new AppError("Staff not found", 404);
    }

    await prisma.staff.delete({
      where: { id: parseInt(id) },
    });

    return true;
  }

  static async getAttendance(staffId) {
    const existingStaff = await prisma.staff.findUnique({
      where: { id: parseInt(staffId) },
    });

    if (!existingStaff) {
      throw new AppError("Staff not found", 404);
    }

    const attendance = await prisma.staffAttendance.findMany({
      where: { staffId: parseInt(staffId) },
      orderBy: { date: 'desc' },
    });

    return attendance;
  }

  static async markAttendance(staffId, data) {
    const existingStaff = await prisma.staff.findUnique({
      where: { id: parseInt(staffId) },
    });

    if (!existingStaff) {
      throw new AppError("Staff not found", 404);
    }

    const targetDate = new Date(data.date);
    targetDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.staffAttendance.findFirst({
      where: {
        staffId: parseInt(staffId),
        date: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingAttendance) {
      // Update existing record
      return await prisma.staffAttendance.update({
        where: { id: existingAttendance.id },
        data: {
          present: data.present,
          remarks: data.remarks || null,
        },
      });
    }

    // Create new record
    return await prisma.staffAttendance.create({
      data: {
        staffId: parseInt(staffId),
        date: targetDate,
        present: data.present,
        remarks: data.remarks || null,
      },
    });
  }
}

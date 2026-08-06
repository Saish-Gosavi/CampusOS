import { prisma } from "../../../config/prisma.js";
import AppError from "../../../utils/AppError.js";
// Restarting backend after schema updates
import bcrypt from "bcryptjs";

export class StaffService {
  static async getStaffByAdmin(hostelId) {
    if (!hostelId) {
      throw new AppError("Admin must be associated with a hostel to manage staff", 400);
    }
    
    const staff = await prisma.staff.findMany({
      where: { hostelId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    
    const wardens = await prisma.warden.findMany({
      where: { hostelId },
      include: { user: true }
    });
    
    const formattedStaff = staff.map(s => ({
      ...s,
      isWarden: false,
      readOnly: false
    }));
    
    const formattedWardens = wardens.map(w => ({
      id: `w_${w.id}`,
      staffId: w.id, // original warden id
      name: w.fullName,
      phone: w.phone,
      designation: "Warden",
      status: w.user?.status || "active",
      isWarden: true,
      readOnly: true,
      userId: w.userId,
      user: w.user
    }));
    
    return [...formattedWardens, ...formattedStaff];
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
        email: data.email || null,
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
        email: data.email ?? existing.email,
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

  static async getAttendance(staffId, isWarden = false) {
    if (isWarden) {
      return prisma.attendance.findMany({
        where: { userId: Number(staffId) },
        orderBy: { date: "desc" },
      });
    }
    return prisma.staffAttendance.findMany({
      where: { staffId: Number(staffId) },
      orderBy: { date: "desc" },
    });
  }

  static async createCredentials(staffId, { username, password }) {
    const staff = await prisma.staff.findUnique({ where: { id: Number(staffId) } });
    if (!staff) throw new AppError("Staff not found", 404);
    if (staff.userId) throw new AppError("Credentials already exist for this staff", 400);

    const d = staff.designation.toLowerCase();
    const isEligible = d.includes("security") || d.includes("mess") || d.includes("librarian") || d.includes("store");
    if (!isEligible) {
      throw new AppError("This staff designation is not eligible for system credentials", 400);
    }
    
    const existingUser = await prisma.user.findUnique({ where: { email: username } });
    if (existingUser) throw new AppError("Username already exists", 400);

    let roleName = "staff"; // fallback
    if (d.includes("security")) roleName = "security";
    else if (d.includes("mess")) roleName = "messmanager";
    else if (d.includes("librarian")) roleName = "librarian";
    else if (d.includes("store")) roleName = "store";

    let role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
       role = await prisma.role.create({ data: { name: roleName } });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: staff.name,
          email: username,
          password: hashedPassword,
          roleId: role.id,
          hostelId: staff.hostelId,
          status: "active"
        }
      });
      
      const updatedStaff = await tx.staff.update({
        where: { id: staff.id },
        data: { userId: newUser.id }
      });
      return { user: newUser, staff: updatedStaff };
    });
  }

  static async resetPassword(staffId, { newPassword }) {
    const staff = await prisma.staff.findUnique({ where: { id: Number(staffId) } });
    if (!staff || !staff.userId) throw new AppError("Staff or credentials not found", 404);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return prisma.user.update({
      where: { id: staff.userId },
      data: { password: hashedPassword }
    });
  }

  static async updateLoginStatus(staffId, { status }) {
    const staff = await prisma.staff.findUnique({ where: { id: Number(staffId) } });
    if (!staff || !staff.userId) throw new AppError("Staff or credentials not found", 404);

    return prisma.user.update({
      where: { id: staff.userId },
      data: { status }
    });
  }
}

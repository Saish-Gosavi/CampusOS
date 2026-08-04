import bcrypt from "bcryptjs";
import { prisma } from "../../../config/prisma.js";
import AppError from "../../../utils/AppError.js";

const ALLOWED_STAFF_ROLES = ["security", "librarian", "store"];
const READONLY_STAFF_ROLES = ["warden"];

export class StaffService {
  static async getStaffByAdmin(hostelId) {
    if (!hostelId) {
      throw new AppError("Admin must be associated with a hostel to manage staff", 400);
    }
    return prisma.user.findMany({
      where: {
        hostelId: hostelId,
        role: {
          name: {
            in: [...ALLOWED_STAFF_ROLES, ...READONLY_STAFF_ROLES],
          },
        },
      },
      include: {
        role: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createStaff(creator, data) {
    if (!creator.hostelId) {
      throw new AppError("Admin must be associated with a hostel to create staff", 400);
    }

    const targetRole = await prisma.role.findUnique({ where: { id: data.roleId } });
    if (!targetRole) {
      throw new AppError("Invalid role ID specified", 400);
    }

    const targetRoleName = targetRole.name.toLowerCase();

    if (READONLY_STAFF_ROLES.includes(targetRoleName)) {
      throw new AppError(`Creation of role '${targetRoleName}' is not allowed in Staff Management. Use Warden Management instead.`, 403);
    }

    if (!ALLOWED_STAFF_ROLES.includes(targetRoleName)) {
      throw new AppError(`Only security, librarian, or store roles can be created here.`, 403);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password || "Password@123", salt);

    // Create user and profile if necessary
    const userData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      status: data.status || "active",
      roleId: targetRole.id,
      hostelId: creator.hostelId,
    };

    if (targetRoleName === "security") {
      userData.securityProfile = {
        create: {
          fullName: data.name,
          phone: data.phone || "",
        }
      };
    }

    return prisma.user.create({
      data: userData,
      include: { role: true },
    });
  }

  static async updateStaff(id, data) {
    const targetUser = await prisma.user.findUnique({ where: { id: Number(id) }, include: { role: true } });
    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    if (READONLY_STAFF_ROLES.includes(targetUser.role.name.toLowerCase())) {
      throw new AppError("Cannot edit wardens from Staff Management.", 403);
    }

    const updateData = {
      name: data.name,
      email: data.email,
      status: data.status,
    };

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    return prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      include: { role: true },
    });
  }

  static async deleteStaff(id) {
    const targetUser = await prisma.user.findUnique({ where: { id: Number(id) }, include: { role: true } });
    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    if (READONLY_STAFF_ROLES.includes(targetUser.role.name.toLowerCase())) {
      throw new AppError("Cannot delete wardens from Staff Management.", 403);
    }

    return prisma.$transaction([
      prisma.securityStaff.deleteMany({ where: { userId: Number(id) } }),
      prisma.staffAttendance.deleteMany({ where: { userId: Number(id) } }),
      prisma.user.delete({ where: { id: Number(id) } }),
    ]);
  }

  static async getAttendance(userId) {
    return prisma.staffAttendance.findMany({
      where: { userId: Number(userId) },
      orderBy: { date: 'desc' },
    });
  }
}

import bcrypt from "bcryptjs";
import { prisma } from "../../../../config/prisma.js";
import { WardenRepository } from "../repository/warden.repository.js";
import AppError from "../../../../utils/AppError.js";

export class WardenService {
  static async getAll(hostelId) {
    return WardenRepository.findAll(hostelId);
  }

  static async getById(id) {
    return WardenRepository.findById(id);
  }

  static async create(data) {
    // 1. Check if email is already taken
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError("A user account with this email address already exists.", 400);
    }

    // 2. Resolve warden role
    let wardenRole = await prisma.role.findUnique({ where: { name: "warden" } });
    if (!wardenRole) {
      wardenRole = await prisma.role.create({
        data: { name: "warden", description: "Hostel Warden" }
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 4. Create User & Warden profile in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.fullName,
          roleId: wardenRole.id,
          hostelId: Number(data.hostelId),
          status: "active",
        }
      });

      const warden = await tx.warden.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          phone: data.phone,
          hostelId: Number(data.hostelId),
          shift: data.shift || "Day",
        },
        include: {
          user: {
            select: { id: true, email: true, status: true, role: true }
          },
          hostel: {
            select: { id: true, name: true, city: true }
          }
        }
      });

      return warden;
    });

    return result;
  }

  static async update(id, data) {
    const wardenId = Number(id);
    const existing = await WardenRepository.findById(wardenId);
    if (!existing) {
      throw new AppError("Warden not found", 404);
    }

    if (data.password && data.password.trim()) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password.trim(), salt);
      await prisma.user.update({
        where: { id: existing.userId },
        data: { password: hashedPassword }
      });
    }

    if (data.fullName) {
      await prisma.user.update({
        where: { id: existing.userId },
        data: { name: data.fullName }
      });
    }

    return prisma.warden.update({
      where: { id: wardenId },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.phone && { phone: data.phone }),
        ...(data.shift && { shift: data.shift }),
        ...(data.hostelId && { hostelId: Number(data.hostelId) }),
      },
      include: {
        user: { select: { id: true, email: true, status: true, role: true } },
        hostel: { select: { id: true, name: true, city: true } }
      }
    });
  }

  static async delete(id) {
    return WardenRepository.delete(id);
  }
}

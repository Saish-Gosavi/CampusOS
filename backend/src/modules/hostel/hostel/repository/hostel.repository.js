import { prisma } from "../../../../config/prisma.js";
import bcrypt from "bcryptjs";

export class HostelRepository {
  static async findAll() {
    return prisma.hostel.findMany({
      include: {
        blocks: true,
        wardens: true,
        users: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  static async findById(id) {
    return prisma.hostel.findUnique({
      where: { id: Number(id) },
      include: {
        blocks: true,
        wardens: true,
        users: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  static async create(data) {
    return prisma.hostel.create({
      data: {
        name: data.name,
        city: data.city || null,
        status: data.status || "Active",
        address: data.address || null,
        hasHostel: data.hasHostel !== undefined ? Boolean(data.hasHostel) : true,
        hasLibrary: data.hasLibrary !== undefined ? Boolean(data.hasLibrary) : true,
        hasInventory: data.hasInventory !== undefined ? Boolean(data.hasInventory) : true,
      },
      include: {
        users: { include: { role: true } },
      },
    });
  }

  static async update(id, data) {
    return prisma.hostel.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        city: data.city !== undefined ? data.city : undefined,
        status: data.status !== undefined ? data.status : undefined,
        address: data.address !== undefined ? data.address : undefined,
        hasHostel: data.hasHostel !== undefined ? Boolean(data.hasHostel) : undefined,
        hasLibrary: data.hasLibrary !== undefined ? Boolean(data.hasLibrary) : undefined,
        hasInventory: data.hasInventory !== undefined ? Boolean(data.hasInventory) : undefined,
      },
      include: {
        users: { include: { role: true } },
      },
    });
  }

  static async createAdminForCollege(hostelId, { name, email, password, roleName }) {
    // 1. Find role ID by role name (e.g. warden, librarian, store, admin)
    const role = await prisma.role.findFirst({
      where: { name: roleName },
    });
    if (!role) {
      throw new Error(`Role '${roleName}' does not exist in system`);
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user linked to this hostel
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: role.id,
        hostelId: Number(hostelId),
        status: "active",
      },
      include: {
        role: true,
      },
    });

    return user;
  }

  static async deleteAdminFromCollege(userId) {
    const id = Number(userId);
    if (!id || isNaN(id)) return null;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return null;

    await prisma.$transaction([
      prisma.student.deleteMany({ where: { userId: id } }),
      prisma.warden.deleteMany({ where: { userId: id } }),
      prisma.securityStaff.deleteMany({ where: { userId: id } }),
      prisma.notification.deleteMany({ where: { userId: id } }),
      prisma.auditLog.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return existing;
  }

  static async delete(id) {
    const hostelId = Number(id);
    await prisma.user.updateMany({
      where: { hostelId },
      data: { hostelId: null },
    });
    return prisma.hostel.delete({
      where: { id: hostelId },
    });
  }
}

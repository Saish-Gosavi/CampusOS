import bcrypt from "bcryptjs";
import { UsersRepository } from "../repository/users.repository.js";
import { prisma } from "../../../config/prisma.js";
import AppError from "../../../utils/AppError.js";

export class UsersService {
  static async getProfile(userId) {
    const user = await UsersRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  static async updateProfile(userId, data) {
    return UsersRepository.updateProfile(userId, data);
  }

  static async getAllUsers(roleName) {
    if (roleName) {
      return prisma.user.findMany({
        where: { role: { name: roleName } },
        include: { role: true },
      });
    }
    return UsersRepository.findAll();
  }

  static async createUser(creator, data) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError("A user with this email address already exists.", 400);
    }

    let roleId = data.roleId;
    if (!roleId && data.roleName) {
      const roleObj = await prisma.role.findFirst({
        where: { name: { equals: data.roleName.toLowerCase() } }
      });
      if (roleObj) roleId = roleObj.id;
    }

    if (!roleId) {
      throw new AppError("Role ID or valid roleName must be specified", 400);
    }

    const targetRole = await prisma.role.findUnique({ where: { id: roleId } });
    if (!targetRole) {
      throw new AppError("Invalid role specified", 400);
    }

    const creatorRoleName = typeof creator.role === "string" ? creator.role.toLowerCase() : (creator.role?.name?.toLowerCase() || "");
    const targetRoleName = targetRole.name.toLowerCase();

    // Enforce hierarchical controls
    if (creatorRoleName === "senioradmin") {
      if (targetRoleName !== "admin") {
        throw new AppError("Senior Admins can only create standard Admin accounts.", 403);
      }
    } else if (creatorRoleName === "admin") {
      const allowedTargetRoles = ["warden", "student", "security", "librarian", "store"];
      if (!allowedTargetRoles.includes(targetRoleName)) {
        throw new AppError("Admins cannot create users with administrative roles higher than or equal to their own.", 403);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const { roleName, campus, ...createData } = data;

    return UsersRepository.create({
      ...createData,
      roleId,
      password: hashedPassword,
    });
  }

  static async deleteUser(creator, id) {
    const creatorRoleName = creator.role.toLowerCase();

    if (creatorRoleName === "senioradmin") {
      const targetUser = await UsersRepository.findById(Number(id));
      if (!targetUser) {
        throw new AppError("User not found", 404);
      }
      if (targetUser.role.name.toLowerCase() !== "admin") {
        throw new AppError("Senior Admins can only delete standard Admin accounts.", 403);
      }
    } else if (creatorRoleName === "admin") {
      const targetUser = await UsersRepository.findById(Number(id));
      if (!targetUser) {
        throw new AppError("User not found", 404);
      }
      const allowedTargetRoles = ["warden", "student", "security", "librarian", "store"];
      if (!allowedTargetRoles.includes(targetUser.role.name.toLowerCase())) {
        throw new AppError("Admins cannot delete users with administrative roles higher than or equal to their own.", 403);
      }
    }

    return UsersRepository.delete(id);
  }

  static async updateUser(creator, id, data) {
    const userId = Number(id);
    const existing = await UsersRepository.findById(userId);
    if (!existing) {
      throw new AppError("User not found", 404);
    }

    if (data.email && data.email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email: data.email } });
      if (emailTaken) {
        throw new AppError("A user with this email address already exists.", 400);
      }
    }

    const { roleName, campus, password, ...updateData } = data;
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password.trim(), salt);
    }

    return UsersRepository.updateProfile(userId, updateData);
  }
}

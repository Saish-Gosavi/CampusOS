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
    const targetRole = await prisma.role.findUnique({ where: { id: data.roleId } });
    if (!targetRole) {
      throw new AppError("Invalid role ID specified", 400);
    }

    const creatorRoleName = creator.role.toLowerCase();
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
    // Strip fields not present in the Prisma User model (e.g. campus)
    const { campus, ...userData } = data;

    // Pre-check: ensure email is not already registered
    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) {
      throw new AppError(`A user with the email "${userData.email}" already exists. Please use a different email.`, 409);
    }

    const hashedPassword = await bcrypt.hash(userData.password, salt);
    try {
      return await UsersRepository.create({
        ...userData,
        password: hashedPassword,
      });
    } catch (err) {
      // Handle Prisma unique constraint violation (P2002) gracefully
      if (err?.code === "P2002" || err?.message?.includes("Unique constraint")) {
        throw new AppError(`A user with the email "${userData.email}" already exists. Please use a different email.`, 409);
      }
      throw err;
    }
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
}

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
    const hashedPassword = await bcrypt.hash(data.password, salt);
    return UsersRepository.create({
      ...data,
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
}

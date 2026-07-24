import bcrypt from "bcryptjs";
import { UsersRepository } from "../repository/users.repository.js";
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

  static async getAllUsers() {
    return UsersRepository.findAll();
  }

  static async createUser(data) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    return UsersRepository.create({
      ...data,
      password: hashedPassword,
    });
  }
}

import { UsersService } from "../services/users.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";

export class UsersController {
  static async getProfile(req, res, next) {
    try {
      const user = await UsersService.getProfile(req.user.id);
      return apiResponse.success(res, user, "Profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const user = await UsersService.updateProfile(req.user.id, req.body);
      return apiResponse.success(res, user, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await UsersService.getAllUsers();
      return apiResponse.success(res, users, "Users list retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const user = await UsersService.createUser(req.body);
      return apiResponse.success(res, user, "User created successfully", 201);
    } catch (error) {
      next(error);
    }
  }
}

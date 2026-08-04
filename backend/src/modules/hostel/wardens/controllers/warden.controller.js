import { WardenService } from "../services/warden.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";

export class WardenController {
  static async getAll(req, res, next) {
    try {
      const { hostelId } = req.query;
      const data = await WardenService.getAll(hostelId);
      return apiResponse.success(res, data, "Wardens list retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const data = await WardenService.getById(req.params.id);
      if (!data) {
        return apiResponse.error(res, "Warden not found", 404);
      }
      return apiResponse.success(res, data, "Warden retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const data = await WardenService.create(req.body);
      return apiResponse.success(res, data, "Warden account created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = await WardenService.update(req.params.id, req.body);
      return apiResponse.success(res, data, "Warden updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await WardenService.delete(req.params.id);
      return apiResponse.success(res, null, "Warden deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

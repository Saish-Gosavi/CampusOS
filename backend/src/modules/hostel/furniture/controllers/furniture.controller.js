import { FurnitureService } from "../services/furniture.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";

export class FurnitureController {
  static async getAll(req, res, next) {
    try {
      const data = await FurnitureService.getAll();
      return apiResponse.success(res, data, "Records retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const data = await FurnitureService.getById(req.params.id);
      if (!data) {
        return apiResponse.error(res, "Record not found", 404);
      }
      return apiResponse.success(res, data, "Record retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const data = await FurnitureService.create(req.body);
      return apiResponse.success(res, data, "Record created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = await FurnitureService.update(req.params.id, req.body);
      return apiResponse.success(res, data, "Record updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await FurnitureService.delete(req.params.id);
      return apiResponse.success(res, null, "Record deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

import { FurnitureService } from "../services/furniture.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";

export class FurnitureController {
  static async getAll(req, res, next) {
    try {
      const items = await FurnitureService.getAll(req.user, req.query);
      return apiResponse.success(res, items, "Furniture assets retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const item = await FurnitureService.getById(req.params.id);
      return apiResponse.success(res, item, "Furniture asset retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const item = await FurnitureService.create(req.user, req.body);
      return apiResponse.success(res, item, "Furniture asset created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const item = await FurnitureService.update(req.user, req.params.id, req.body);
      return apiResponse.success(res, item, "Furniture asset updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await FurnitureService.delete(req.user, req.params.id);
      return apiResponse.success(res, null, "Furniture asset deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

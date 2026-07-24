import { HostelService } from "../services/hostel.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";

export class HostelController {
  static async getAll(req, res, next) {
    try {
      const data = await HostelService.getAll();
      return apiResponse.success(res, data, "Records retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const data = await HostelService.getById(req.params.id);
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
      const data = await HostelService.create(req.body);
      return apiResponse.success(res, data, "Record created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = await HostelService.update(req.params.id, req.body);
      return apiResponse.success(res, data, "Record updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await HostelService.delete(req.params.id);
      return apiResponse.success(res, null, "Record deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createAdminForCollege(req, res, next) {
    try {
      const data = await HostelService.createAdminForCollege(req.params.id, req.body);
      return apiResponse.success(res, data, "College admin created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAdminFromCollege(req, res, next) {
    try {
      await HostelService.deleteAdminFromCollege(req.params.userId);
      return apiResponse.success(res, null, "College admin deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

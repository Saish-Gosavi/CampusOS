import { InspectionService } from "../services/inspection.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";

export class InspectionController {
  static async getAll(req, res, next) {
    try {
      const inspections = await InspectionService.getAll(req.user, req.query);
      return apiResponse.success(res, inspections, "Room inspections retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const inspection = await InspectionService.getById(req.params.id);
      return apiResponse.success(res, inspection, "Room inspection retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const inspection = await InspectionService.create(req.user, req.body);
      return apiResponse.success(res, inspection, "Room inspection recorded successfully", 201);
    } catch (error) {
      next(error);
    }
  }
}

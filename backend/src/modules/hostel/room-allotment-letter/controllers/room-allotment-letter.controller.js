import { RoomAllotmentLetterService } from "../services/room-allotment-letter.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";
import { AuditLogService } from "../../../../core/audit/auditLog.service.js";

export class RoomAllotmentLetterController {
  static async getAll(req, res, next) {
    try {
      const data = await RoomAllotmentLetterService.getAll();
      return apiResponse.success(res, data, "Allotment letters retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const data = await RoomAllotmentLetterService.getById(req.params.id);
      return apiResponse.success(res, data, "Allotment letter retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const data = await RoomAllotmentLetterService.create(req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Create Allotment Letter",
        description: `Generated room allotment letter ${data.referenceNo} for allocation ID: ${data.allocationId}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: data,
      });
      return apiResponse.success(res, data, "Allotment letter created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = await RoomAllotmentLetterService.update(req.params.id, req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Update Allotment Letter",
        description: `Updated room allotment letter ID: ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: data,
      });
      return apiResponse.success(res, data, "Allotment letter updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await RoomAllotmentLetterService.delete(req.params.id);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Delete Allotment Letter",
        description: `Deleted room allotment letter ID: ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, null, "Allotment letter deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

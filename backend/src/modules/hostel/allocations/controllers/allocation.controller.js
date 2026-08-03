import { AllocationService } from "../services/allocation.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";
import { AuditLogService } from "../../../../core/audit/auditLog.service.js";

export class AllocationController {
  static async getAll(req, res, next) {
    try {
      const data = await AllocationService.getAll();
      return apiResponse.success(res, data, "Records retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const data = await AllocationService.getById(req.params.id);
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
      const data = await AllocationService.create(req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Create Allocation",
        description: `Allocated room/bed for student ID: ${data.studentId || req.body.studentId}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: data,
      });
      return apiResponse.success(res, data, "Record created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = await AllocationService.update(req.params.id, req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Update Allocation",
        description: `Updated allocation record ID: ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: data,
      });
      return apiResponse.success(res, data, "Record updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await AllocationService.delete(req.params.id);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Delete Allocation",
        description: `Removed allocation record ID: ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, null, "Record deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

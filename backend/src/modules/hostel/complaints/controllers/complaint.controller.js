import { ComplaintService } from "../services/complaint.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";
import { AuditLogService } from "../../../../core/audit/auditLog.service.js";

export class ComplaintController {
  static async getAll(req, res, next) {
    try {
      const data = await ComplaintService.getAll(req.query);
      return apiResponse.success(res, data, "Records retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const data = await ComplaintService.getById(req.params.id);
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
      const data = await ComplaintService.create(req.body, req.user);
      
      await AuditLogService.logAction({
        userId: req.user?.id || null,
        module: "Hostel",
        action: "CREATE_COMPLAINT",
        description: `Created complaint '${data.title}' (ID: ${data.id})`,
        status: "Success",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || null,
        newData: data,
      });

      return apiResponse.success(res, data, "Record created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const oldData = await ComplaintService.getById(req.params.id);
      const data = await ComplaintService.update(req.params.id, req.body);

      await AuditLogService.logAction({
        userId: req.user?.id || null,
        module: "Hostel",
        action: "UPDATE_COMPLAINT",
        description: `Updated complaint ID ${req.params.id} ('${data.title}')`,
        status: "Success",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || null,
        oldData,
        newData: data,
      });

      return apiResponse.success(res, data, "Record updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const oldData = await ComplaintService.getById(req.params.id);
      await ComplaintService.delete(req.params.id);

      await AuditLogService.logAction({
        userId: req.user?.id || null,
        module: "Hostel",
        action: "DELETE_COMPLAINT",
        description: `Deleted complaint ID ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || null,
        oldData,
      });

      return apiResponse.success(res, null, "Record deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}


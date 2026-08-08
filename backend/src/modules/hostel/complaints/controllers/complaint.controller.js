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

  static async accept(req, res, next) {
    try {
      const complaint = await ComplaintService.getById(req.params.id);
      if (!complaint) {
        return apiResponse.error(res, "Complaint not found", 404);
      }
      if (complaint.status !== "open") {
        return apiResponse.error(res, `Complaint cannot be approved in status '${complaint.status}'`, 400);
      }
      const updated = await ComplaintService.update(req.params.id, { status: "approved" });
      await AuditLogService.logAction({
        userId: req.user?.id || null,
        module: "Hostel",
        action: "APPROVE_COMPLAINT",
        description: `Approved complaint ID ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || null,
        newData: updated,
      });
      return apiResponse.success(res, updated, "Complaint approved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async reject(req, res, next) {
    try {
      const complaint = await ComplaintService.getById(req.params.id);
      if (!complaint) {
        return apiResponse.error(res, "Complaint not found", 404);
      }
      if (complaint.status !== "open") {
        return apiResponse.error(res, `Complaint cannot be rejected in status '${complaint.status}'`, 400);
      }
      const { rejectionReason } = req.body;
      const updated = await ComplaintService.update(req.params.id, { status: "rejected", rejectionReason });
      await AuditLogService.logAction({
        userId: req.user?.id || null,
        module: "Hostel",
        action: "REJECT_COMPLAINT",
        description: `Rejected complaint ID ${req.params.id}: ${rejectionReason}`,
        status: "Success",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || null,
        newData: updated,
      });
      return apiResponse.success(res, updated, "Complaint rejected successfully");
    } catch (error) {
      next(error);
    }
  }

  static async markInProgress(req, res, next) {
    try {
      const complaint = await ComplaintService.getById(req.params.id);
      if (!complaint) {
        return apiResponse.error(res, "Complaint not found", 404);
      }
      if (complaint.status !== "approved") {
        return apiResponse.error(res, `Complaint cannot be moved to in-progress from status '${complaint.status}'`, 400);
      }
      const updated = await ComplaintService.update(req.params.id, { status: "in_progress" });
      await AuditLogService.logAction({
        userId: req.user?.id || null,
        module: "Hostel",
        action: "COMPLAINT_IN_PROGRESS",
        description: `Marked complaint ID ${req.params.id} as in-progress`,
        status: "Success",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || null,
        newData: updated,
      });
      return apiResponse.success(res, updated, "Complaint marked as in-progress");
    } catch (error) {
      next(error);
    }
  }

  static async resolve(req, res, next) {
    try {
      const complaint = await ComplaintService.getById(req.params.id);
      if (!complaint) {
        return apiResponse.error(res, "Complaint not found", 404);
      }
      if (complaint.status !== "in_progress") {
        return apiResponse.error(res, `Complaint cannot be resolved from status '${complaint.status}'`, 400);
      }
      const { resolution } = req.body;
      const updated = await ComplaintService.update(req.params.id, { status: "resolved", resolution });
      await AuditLogService.logAction({
        userId: req.user?.id || null,
        module: "Hostel",
        action: "RESOLVE_COMPLAINT",
        description: `Resolved complaint ID ${req.params.id}: ${resolution}`,
        status: "Success",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || null,
        newData: updated,
      });
      return apiResponse.success(res, updated, "Complaint resolved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async close(req, res, next) {
    try {
      const complaint = await ComplaintService.getById(req.params.id);
      if (!complaint) {
        return apiResponse.error(res, "Complaint not found", 404);
      }
      if (complaint.status !== "resolved") {
        return apiResponse.error(res, `Complaint cannot be closed from status '${complaint.status}'`, 400);
      }
      const updated = await ComplaintService.update(req.params.id, { status: "closed" });
      await AuditLogService.logAction({
        userId: req.user?.id || null,
        module: "Hostel",
        action: "CLOSE_COMPLAINT",
        description: `Closed complaint ID ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || null,
        newData: updated,
      });
      return apiResponse.success(res, updated, "Complaint closed successfully");
    } catch (error) {
      next(error);
    }
  }


}


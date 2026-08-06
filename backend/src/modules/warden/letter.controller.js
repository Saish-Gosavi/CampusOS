import { WardenLetterService } from "./letter.service.js";
import { apiResponse } from "../../helpers/response.helper.js";
import { AuditLogService } from "../../core/audit/auditLog.service.js";

export class WardenLetterController {
  static async getWardenRequests(req, res, next) {
    try {
      const data = await WardenLetterService.getWardenRequests(req.user);
      return apiResponse.success(res, data, "Letter requests retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async approveRequest(req, res, next) {
    try {
      const data = await WardenLetterService.approveRequest(req.params.id, req.user, {
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return apiResponse.success(res, data, "Letter request approved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async rejectRequest(req, res, next) {
    try {
      const { rejectionReason } = req.body;
      const data = await WardenLetterService.rejectRequest(req.params.id, req.user, rejectionReason, {
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return apiResponse.success(res, data, "Letter request rejected");
    } catch (error) {
      next(error);
    }
  }

  static async generateLetter(req, res, next) {
    try {
      const data = await WardenLetterService.generateLetter(req.params.id, req.user, {
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return apiResponse.success(res, data, "Allocation letter generated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async studentSubmitRequest(req, res, next) {
    try {
      const data = await WardenLetterService.studentSubmitRequest(req.user, {
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return apiResponse.success(res, data, "Letter request submitted successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async studentGetRequests(req, res, next) {
    try {
      const data = await WardenLetterService.studentGetRequests(req.user);
      return apiResponse.success(res, data, "Student letter requests retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async logDownload(req, res, next) {
    try {
      const { letterId, referenceNo } = req.body;
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel Operations",
        action: "Letter Downloaded",
        description: `User ${req.user?.name || req.user?.email} downloaded allocation letter ref: ${referenceNo || letterId}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return apiResponse.success(res, null, "Download logged");
    } catch (error) {
      next(error);
    }
  }
}

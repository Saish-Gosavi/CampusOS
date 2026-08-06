import { VisitorService } from "../services/visitor.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";
import { AuditLogService } from "../../../../core/audit/auditLog.service.js";

export class VisitorController {
  /** GET /visitors — all records (super admin / generic) */
  static async getAll(req, res, next) {
    try {
      const data = await VisitorService.getAll();
      return apiResponse.success(res, data, "Visitor records retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /** GET /visitors/pending — only Pending, for Warden queue */
  static async getPending(req, res, next) {
    try {
      const data = await VisitorService.getPending();
      return apiResponse.success(res, data, "Pending visitor requests retrieved");
    } catch (error) {
      next(error);
    }
  }

  /** GET /visitors/processed — Approved/Rejected/Checked-In/Out, for Admin view */
  static async getProcessed(req, res, next) {
    try {
      const data = await VisitorService.getProcessed();
      return apiResponse.success(res, data, "Processed visitor records retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const data = await VisitorService.getById(req.params.id);
      if (!data) {
        return apiResponse.error(res, "Visitor record not found", 404);
      }
      return apiResponse.success(res, data, "Visitor record retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const data = await VisitorService.create(req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Create Visitor Request",
        description: `Created visitor request for ${data.fullName} (Student: ${data.studentName})`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: { id: data.id, fullName: data.fullName, status: data.status },
      });
      return apiResponse.success(res, data, "Visitor request created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  /** PUT /visitors/:id/review — Warden approves or rejects */
  static async wardenReview(req, res, next) {
    try {
      const { status, wardenRemarks, reviewedBy } = req.body;
      const data = await VisitorService.wardenReview(req.params.id, {
        status,
        wardenRemarks,
        reviewedBy: reviewedBy || req.user?.name || "Warden",
      });
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Warden Visitor Review",
        description: `Warden ${status === "Approved" ? "approved" : "rejected"} visitor request for ${data.fullName}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: { id: data.id, status: data.status, reviewedBy: data.reviewedBy },
      });
      return apiResponse.success(res, data, `Visitor request ${status.toLowerCase()} by warden`);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const data = await VisitorService.update(req.params.id, req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Update Visitor Request",
        description: `Updated visitor status to "${data.status}" for ${data.fullName}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: { id: data.id, status: data.status, remarks: data.remarks },
      });
      return apiResponse.success(res, data, "Visitor record updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await VisitorService.delete(req.params.id);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Hostel",
        action: "Delete Visitor Request",
        description: `Deleted visitor record ID ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, null, "Visitor record deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

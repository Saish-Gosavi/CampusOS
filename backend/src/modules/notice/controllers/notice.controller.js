import { NoticeService } from "../services/notice.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";
import { AuditLogService } from "../../../core/audit/auditLog.service.js";

export class NoticeController {
  static async getAll(req, res, next) {
    try {
      const notices = await NoticeService.getAll();
      return apiResponse.success(res, notices, "Notices retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const notice = await NoticeService.create(req.body, req.user.id);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Create Notice",
        description: `Created global notice: "${notice.title || req.body.title}"`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: notice,
      });
      return apiResponse.success(res, notice, "Notice created successfully", 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const notice = await NoticeService.update(req.params.id, req.body, req.user.id);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Update Notice",
        description: `Updated notice ID: ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: notice,
      });
      return apiResponse.success(res, notice, "Notice updated successfully");
    } catch (err) {
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      await NoticeService.remove(req.params.id, req.user.id);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Delete Notice",
        description: `Deleted notice ID: ${req.params.id}`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, null, "Notice deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

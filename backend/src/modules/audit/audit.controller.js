import { AuditLogService } from "../../core/audit/auditLog.service.js";

export class AuditLogController {
  static async getLogs(req, res, next) {
    try {
      const { page, limit, search, module, action, status, startDate, endDate } = req.query;
      const data = await AuditLogService.getLogs({
        page,
        limit,
        search,
        module,
        action,
        status,
        startDate,
        endDate,
      });
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

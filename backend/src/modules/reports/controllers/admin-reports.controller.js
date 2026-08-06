import { AdminReportsService } from "../services/admin-reports.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";
import { AuditLogService } from "../../../core/audit/auditLog.service.js";

export class AdminReportsController {
  /**
   * GET /api/admin/reports
   * Retrieves hostel metrics, module statistics, search, and paginated records.
   */
  static async getReports(req, res, next) {
    try {
      const data = await AdminReportsService.getSummaryStats(req.query || {});

      // Audit Log for GET action
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Reports",
        action: `View ${req.query?.module || "Overview"} Reports`,
        description: `Admin fetched reports and metrics for ${req.query?.module || "Overview"} module`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      }).catch(() => {});

      return apiResponse.success(res, data, "Admin reports data retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/reports
   * Generates report file, records audit log, and streams file download.
   */
  static async generateReport(req, res, next) {
    try {
      const { reportType = "Overview", startDate, endDate, format = "csv" } = req.body || {};

      const csvContent = await AdminReportsService.generateReportContent(
        { reportType, startDate, endDate },
        req.user
      );

      // Audit Log for POST report generation
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "Reports",
        action: `Generate ${reportType} Report`,
        description: `Admin generated ${reportType} report (${format.toUpperCase()})`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      }).catch(() => {});

      // Record in GeneratedReport table if available
      try {
        const { prisma } = await import("../../../config/prisma.js");
        await prisma.generatedReport.create({
          data: {
            name: `Admin ${reportType} Report`,
            category: reportType,
            format: format.toUpperCase(),
            filters: JSON.stringify({ startDate, endDate }),
            generatedBy: req.user?.name || req.user?.email || "Hostel Admin",
            createdById: req.user?.id || null,
          },
        });
      } catch {
        // Ignored if optional
      }

      const filename = `Hostel_${reportType.replace(/[^a-zA-Z0-9]/g, "_")}_Report_${Date.now()}.csv`;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      return res.status(200).send(csvContent);
    } catch (error) {
      next(error);
    }
  }
}

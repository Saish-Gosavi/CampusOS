import { ReportsService } from "../services/reports.service.js";
import { prisma } from "../../../config/prisma.js";
import { apiResponse } from "../../../helpers/response.helper.js";

export class ReportsController {
  // GET /api/super_admin/reports
  static async getSummary(req, res, next) {
    try {
      const { hostelId } = req.query;
      const data = await ReportsService.getSummaryStats(hostelId);

      // Write an Audit Log for tracking
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: "VIEW_REPORTS",
          details: `Super Admin viewed summary reports. Filter: ${hostelId ? 'Hostel ID ' + hostelId : 'All'}`,
          ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        }
      });

      return apiResponse.success(res, data, "Summary reports fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  // POST /api/super_admin/reports
  static async exportCsv(req, res, next) {
    try {
      const hostelId = req.body?.hostelId || req.query?.hostelId;
      const csvString = await ReportsService.generateCsvReport(req.user, hostelId);

      // Write an Audit Log for tracking
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: "GENERATE_REPORT",
          details: `Super Admin exported system summary report as CSV. Filter: ${hostelId ? 'Hostel ID ' + hostelId : 'All'}`,
          ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        }
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=system_report_${Date.now()}.csv`);
      return res.status(200).send(csvString);
    } catch (error) {
      next(error);
    }
  }
}

import { DashboardService } from "../services/dashboard.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";

export class DashboardController {
  static async getSuperAdminStats(req, res, next) {
    try {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      const data = await DashboardService.getSuperAdminDashboard();
      return apiResponse.success(res, data, "Super Admin dashboard statistics retrieved");
    } catch (error) {
      next(error);
    }
  }
}

import { DashboardService } from "../services/dashboard.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";

export class DashboardController {
  static async getSuperAdminStats(req, res, next) {
    try {
      const data = await DashboardService.getSuperAdminDashboard();
      return apiResponse.success(res, data, "Super Admin dashboard statistics retrieved");
    } catch (error) {
      next(error);
    }
  }
}

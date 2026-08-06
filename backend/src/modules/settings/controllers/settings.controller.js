import { SettingsService } from "../services/settings.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";
import { AuditLogService } from "../../../core/audit/auditLog.service.js";

export class SettingsController {
  static async getSettings(req, res, next) {
    try {
      const data = await SettingsService.getSettings();
      return apiResponse.success(res, data, "Settings retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req, res, next) {
    try {
      const data = await SettingsService.updateSettings(req.body);
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Settings Change",
        description: `Updated platform settings configuration`,
        status: "Success",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        newData: data,
      });
      return apiResponse.success(res, data, "Settings updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async resetSettings(req, res, next) {
    try {
      const data = await SettingsService.resetSettings();
      await AuditLogService.logAction({
        userId: req.user?.id,
        module: "System",
        action: "Settings Reset",
        description: `Reset system settings to factory default`,
        status: "Warning",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return apiResponse.success(res, data, "Settings reset to default values");
    } catch (error) {
      next(error);
    }
  }
}

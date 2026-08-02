import { SettingsService } from "../services/settings.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";

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
      return apiResponse.success(res, data, "Settings updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async resetSettings(req, res, next) {
    try {
      const data = await SettingsService.resetSettings();
      return apiResponse.success(res, data, "Settings reset to default values");
    } catch (error) {
      next(error);
    }
  }
}

import { SettingsRepository } from "../repository/settings.repository.js";

export class SettingsService {
  static async getSettings() {
    return SettingsRepository.getSettings();
  }

  static async updateSettings(data) {
    return SettingsRepository.updateSettings(data);
  }

  static async resetSettings() {
    return SettingsRepository.resetSettings();
  }
}

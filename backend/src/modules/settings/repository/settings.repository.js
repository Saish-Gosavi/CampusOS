import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "src", "config", "settings.json");

const DEFAULT_SETTINGS = {
  portalName: "CampusOS Portal",
  orgName: "VPPCOE — Mumbai",
  supportEmail: "support@campusos.edu.in",
  timezone: "Asia/Kolkata (GMT+5:30)",
  currency: "INR (₹)",
  defaultLanguage: "English (US)",
  sessionTimeoutMinutes: "30",
  maxLoginAttempts: "5",
  require2FA: true,
  passwordMinLength: "8",
  requireSpecialChar: true,
  smtpHost: "smtp.campusos.edu.in",
  smtpPort: "587",
  smtpSender: "noreply@campusos.edu.in",
  enableEmailAlerts: true,
  enablePushNotifications: true,
  notifyNewLeaveRequests: true,
  notifyOverdueBooks: true,
  moduleHostel: true,
  moduleLibrary: true,
  moduleInventory: true,
  autoBackupInterval: "Daily",
  maintenanceMode: false,
};

export class SettingsRepository {
  static getSettings() {
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      }
    } catch (error) {
      console.error("Error reading settings file:", error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  static updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), "utf-8");
    } catch (error) {
      console.error("Error writing settings file:", error);
    }
    return updated;
  }

  static resetSettings() {
    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
    } catch (error) {
      console.error("Error resetting settings file:", error);
    }
    return { ...DEFAULT_SETTINGS };
  }
}

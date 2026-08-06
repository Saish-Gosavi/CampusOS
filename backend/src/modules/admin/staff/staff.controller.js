import { StaffService } from "./staff.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";
import { AuditLogService } from "../../../core/audit/auditLog.service.js";

export class StaffController {
  static async getAllStaff(req, res, next) {
    try {
      const staffList = await StaffService.getStaffByAdmin(req.user.hostelId);
      return apiResponse.success(res, staffList, "Staff retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createStaff(req, res, next) {
    try {
      const staff = await StaffService.createStaff(req.user.hostelId, req.body);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Staff Management",
        action: "CREATE_STAFF",
        description: `Added staff: ${staff.name} (${staff.designation})`,
        ipAddress: req.ip,
        newData: staff,
      });

      return apiResponse.success(res, staff, "Staff created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateStaff(req, res, next) {
    try {
      const staff = await StaffService.updateStaff(req.params.id, req.body);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Staff Management",
        action: "UPDATE_STAFF",
        description: `Updated staff: ${staff.name}`,
        ipAddress: req.ip,
        newData: staff,
      });

      return apiResponse.success(res, staff, "Staff updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async deleteStaff(req, res, next) {
    try {
      await StaffService.deleteStaff(req.params.id);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Staff Management",
        action: "DELETE_STAFF",
        description: `Deleted staff ID: ${req.params.id}`,
        ipAddress: req.ip,
      });

      return apiResponse.success(res, null, "Staff deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAttendance(req, res, next) {
    try {
      const isWarden = req.query.isWarden === "true";
      const records = await StaffService.getAttendance(req.params.id, isWarden);
      return apiResponse.success(res, records, "Attendance retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createCredentials(req, res, next) {
    try {
      const result = await StaffService.createCredentials(req.params.id, req.body);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Staff Management",
        action: "CREATE_STAFF_CREDENTIAL",
        description: `Created credentials for staff ID: ${req.params.id}`,
        ipAddress: req.ip,
      });

      return apiResponse.success(res, result, "Credentials created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      await StaffService.resetPassword(req.params.id, req.body);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Staff Management",
        action: "RESET_PASSWORD",
        description: `Reset password for staff ID: ${req.params.id}`,
        ipAddress: req.ip,
      });

      return apiResponse.success(res, null, "Password reset successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateLoginStatus(req, res, next) {
    try {
      await StaffService.updateLoginStatus(req.params.id, req.body);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Staff Management",
        action: "UPDATE_LOGIN_STATUS",
        description: `Updated login status for staff ID: ${req.params.id} to ${req.body.status}`,
        ipAddress: req.ip,
      });

      return apiResponse.success(res, null, "Login status updated successfully");
    } catch (error) {
      next(error);
    }
  }
}

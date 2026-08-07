import { WardenStaffService } from "./warden-staff.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";
import { AuditLogService } from "../../../core/audit/auditLog.service.js";

export class WardenStaffController {
  static async getAllStaff(req, res, next) {
    try {
      // Assuming warden profile is populated in req.user, 
      // but usually hostelId is attached directly to req.user for both wardens and admins in this system.
      const hostelId = req.user.hostelId;
      const staffList = await WardenStaffService.getStaffByWarden(hostelId);
      return apiResponse.success(res, staffList, "Staff retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async createStaff(req, res, next) {
    try {
      const staff = await WardenStaffService.createStaff(req.user.hostelId, req.body);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Warden Staff Management",
        action: "CREATE_STAFF",
        description: `Warden added staff: ${staff.name} (${staff.designation})`,
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
      const staff = await WardenStaffService.updateStaff(req.params.id, req.body);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Warden Staff Management",
        action: "UPDATE_STAFF",
        description: `Warden updated staff: ${staff.name}`,
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
      await WardenStaffService.deleteStaff(req.params.id);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Warden Staff Management",
        action: "DELETE_STAFF",
        description: `Warden deleted staff ID: ${req.params.id}`,
        ipAddress: req.ip,
      });

      return apiResponse.success(res, null, "Staff deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAttendance(req, res, next) {
    try {
      const records = await WardenStaffService.getAttendance(req.params.id);
      return apiResponse.success(res, records, "Attendance retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async markAttendance(req, res, next) {
    try {
      const record = await WardenStaffService.markAttendance(req.params.id, req.body);
      
      await AuditLogService.logAction({
        userId: req.user.id,
        module: "Warden Staff Management",
        action: "MARK_ATTENDANCE",
        description: `Warden marked attendance for staff ID: ${req.params.id} as ${req.body.present ? 'Present' : 'Absent'} for date ${req.body.date}`,
        ipAddress: req.ip,
        newData: record,
      });

      return apiResponse.success(res, record, "Attendance marked successfully");
    } catch (error) {
      next(error);
    }
  }
}

import { StaffService } from "./staff.service.js";
import { apiResponse } from "../../../helpers/response.helper.js";

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
      const staff = await StaffService.createStaff(req.user, req.body);
      return apiResponse.success(res, staff, "Staff created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateStaff(req, res, next) {
    try {
      const staff = await StaffService.updateStaff(req.params.id, req.body);
      return apiResponse.success(res, staff, "Staff updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async deleteStaff(req, res, next) {
    try {
      await StaffService.deleteStaff(req.params.id);
      return apiResponse.success(res, null, "Staff deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAttendance(req, res, next) {
    try {
      const records = await StaffService.getAttendance(req.params.id);
      return apiResponse.success(res, records, "Attendance retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

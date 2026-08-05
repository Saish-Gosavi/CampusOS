import { LeaveService } from "../services/leave.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";

// Leave Controller handles admin leave operations
export class LeaveController {
  // GET /api/hostel/leaves?status=pending&leaveType=Medical&search=&page=1&limit=20
  static async getAll(req, res, next) {
    try {
      const { status, leaveType, search, hostelId, page, limit } = req.query;
      const data = await LeaveService.getAll({ status, leaveType, search, hostelId, page, limit });
      return apiResponse.success(res, data, "Leave requests retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // GET /api/hostel/leaves/stats
  static async getStats(req, res, next) {
    try {
      const data = await LeaveService.getStats();
      return apiResponse.success(res, data, "Stats retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // GET /api/hostel/leaves/:id
  static async getById(req, res, next) {
    try {
      const data = await LeaveService.getById(req.params.id);
      return apiResponse.success(res, data, "Leave request retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // POST /api/hostel/leaves
  static async create(req, res, next) {
    try {
      const data = await LeaveService.create(req.body);
      return apiResponse.success(res, data, "Leave request submitted successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/hostel/leaves/:id/status  — Approve / Reject
  static async updateStatus(req, res, next) {
    try {
      const adminName = req.user?.name || "Admin";
      const data = await LeaveService.updateStatus(req.params.id, req.body, adminName);
      return apiResponse.success(res, data, `Leave request ${req.body.status} successfully`);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/hostel/leaves/:id  — Edit pending request
  static async update(req, res, next) {
    try {
      const data = await LeaveService.update(req.params.id, req.body);
      return apiResponse.success(res, data, "Leave request updated successfully");
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/hostel/leaves/:id
  static async delete(req, res, next) {
    try {
      await LeaveService.delete(req.params.id);
      return apiResponse.success(res, null, "Leave request deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

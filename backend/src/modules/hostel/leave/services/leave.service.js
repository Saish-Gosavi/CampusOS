import { LeaveRepository } from "../repository/leave.repository.js";
import AppError from "../../../../utils/AppError.js";

export class LeaveService {
  static async getAll(filters = {}) {
    return LeaveRepository.findAll(filters);
  }

  static async getById(id) {
    const record = await LeaveRepository.findById(id);
    if (!record) throw new AppError("Leave request not found", 404);
    return record;
  }

  static async create(data) {
    if (!data.studentId) throw new AppError("Student ID is required", 400);
    if (!data.reason) throw new AppError("Reason is required", 400);
    if (!data.startDate || !data.endDate) throw new AppError("Start and end date are required", 400);
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) throw new AppError("End date must be after start date", 400);
    return LeaveRepository.create(data);
  }

  static async updateStatus(id, statusData, adminName) {
    const { status, remarks } = statusData;
    if (!["approved", "rejected"].includes(status)) {
      throw new AppError("Status must be 'approved' or 'rejected'", 400);
    }
    if (status === "rejected" && !remarks?.trim()) {
      throw new AppError("Remarks are required when rejecting a leave request", 400);
    }
    const existing = await LeaveRepository.findById(id);
    if (!existing) throw new AppError("Leave request not found", 404);

    return LeaveRepository.updateStatus(id, {
      status,
      remarks: remarks?.trim(),
      reviewedBy: adminName || "Admin"
    });
  }

  static async update(id, data) {
    const existing = await LeaveRepository.findById(id);
    if (!existing) throw new AppError("Leave request not found", 404);
    if (existing.status !== "pending") throw new AppError("Only pending requests can be edited", 400);
    return LeaveRepository.update(id, data);
  }

  static async delete(id) {
    const existing = await LeaveRepository.findById(id);
    if (!existing) throw new AppError("Leave request not found", 404);
    return LeaveRepository.delete(id);
  }

  static async getStats() {
    return LeaveRepository.getStats();
  }
}

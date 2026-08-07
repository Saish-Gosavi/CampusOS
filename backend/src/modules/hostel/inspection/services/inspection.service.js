import { InspectionRepository } from "../repository/inspection.repository.js";
import { AuditLogService } from "../../../../core/audit/auditLog.service.js";
import AppError from "../../../../utils/AppError.js";

export class InspectionService {
  static async getAll(user, query = {}) {
    const hostelId = user?.hostelId || null;
    return InspectionRepository.findAll({ ...query, hostelId });
  }

  static async getById(id) {
    const inspection = await InspectionRepository.findById(id);
    if (!inspection) {
      throw new AppError("Room inspection record not found", 404);
    }
    return inspection;
  }

  static async create(user, data) {
    const inspectionData = {
      ...data,
      inspectedById: user.id,
    };

    const inspection = await InspectionRepository.create(inspectionData);

    await AuditLogService.logAction({
      userId: user.id,
      module: "Room Inspection",
      action: "Log Room Inspection",
      description: `Logged room inspection ${inspection.inspectionCode} for Room ID ${inspection.roomId} (Status: ${inspection.status})`,
      status: "Success",
    });

    return inspection;
  }
}

import { FurnitureRepository } from "../repository/furniture.repository.js";
import { AuditLogService } from "../../../../core/audit/auditLog.service.js";
import AppError from "../../../../utils/AppError.js";

export class FurnitureService {
  static async getAll(user, query = {}) {
    const hostelId = user?.hostelId || null;
    return FurnitureRepository.findAll({ ...query, hostelId });
  }

  static async getById(id) {
    const item = await FurnitureRepository.findById(id);
    if (!item) {
      throw new AppError("Furniture asset not found", 404);
    }
    return item;
  }

  static async create(user, data) {
    const asset = await FurnitureRepository.create(data);

    await AuditLogService.logAction({
      userId: user?.id,
      module: "Furniture",
      action: "Create Furniture Asset",
      description: `Added furniture asset ${asset.name} (${asset.assetCode})`,
      status: "Success",
    });

    return asset;
  }

  static async update(user, id, data) {
    const existing = await FurnitureRepository.findById(id);
    if (!existing) {
      throw new AppError("Furniture asset not found", 404);
    }

    const updated = await FurnitureRepository.update(id, data);

    await AuditLogService.logAction({
      userId: user?.id,
      module: "Furniture",
      action: "Update Furniture Asset",
      description: `Updated furniture asset ${updated.name} condition to ${updated.condition}`,
      status: "Success",
    });

    return updated;
  }

  static async delete(user, id) {
    const existing = await FurnitureRepository.findById(id);
    if (!existing) {
      throw new AppError("Furniture asset not found", 404);
    }

    const deleted = await FurnitureRepository.delete(id);

    await AuditLogService.logAction({
      userId: user?.id,
      module: "Furniture",
      action: "Delete Furniture Asset",
      description: `Deleted furniture asset ${existing.name} (${existing.assetCode})`,
      status: "Success",
    });

    return deleted;
  }
}

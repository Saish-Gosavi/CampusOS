import { RoomAllotmentLetterRepository } from "../repository/room-allotment-letter.repository.js";
import AppError from "../../../../utils/AppError.js";

export class RoomAllotmentLetterService {
  static async getAll() {
    return RoomAllotmentLetterRepository.findAll();
  }

  static async getById(id) {
    const letter = await RoomAllotmentLetterRepository.findById(id);
    if (!letter) {
      throw new AppError("Room allotment letter not found", 404);
    }
    return letter;
  }

  static async create(data) {
    // Check if letter already exists for this allocation
    const existing = await RoomAllotmentLetterRepository.findByAllocationId(data.allocationId);
    if (existing) {
      throw new AppError("Allotment letter already generated for this allocation", 400);
    }

    // Generate unique reference number AL-YYYY-XXXXX
    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    const referenceNo = `AL-${year}-${rand}`;

    return RoomAllotmentLetterRepository.create({
      ...data,
      referenceNo,
    });
  }

  static async update(id, data) {
    await this.getById(id); // Throws if not found
    return RoomAllotmentLetterRepository.update(id, data);
  }

  static async delete(id) {
    await this.getById(id); // Throws if not found
    return RoomAllotmentLetterRepository.delete(id);
  }
}

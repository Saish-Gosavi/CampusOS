import { FloorRepository } from "../repository/floor.repository.js";

export class FloorService {
  static async getAll(blockId) {
    return FloorRepository.findAll(blockId);
  }

  static async getById(id) {
    return FloorRepository.findById(id);
  }

  static async create(data) {
    return FloorRepository.create(data);
  }

  static async update(id, data) {
    return FloorRepository.update(id, data);
  }

  static async delete(id) {
    return FloorRepository.delete(id);
  }
}

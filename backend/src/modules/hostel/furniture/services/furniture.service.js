import { FurnitureRepository } from "../repository/furniture.repository.js";

export class FurnitureService {
  static async getAll() {
    return FurnitureRepository.findAll();
  }

  static async getById(id) {
    return FurnitureRepository.findById(id);
  }

  static async create(data) {
    return FurnitureRepository.create(data);
  }

  static async update(id, data) {
    return FurnitureRepository.update(id, data);
  }

  static async delete(id) {
    return FurnitureRepository.delete(id);
  }
}

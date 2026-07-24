import { BedRepository } from "../repository/bed.repository.js";

export class BedService {
  static async getAll() {
    return BedRepository.findAll();
  }

  static async getById(id) {
    return BedRepository.findById(id);
  }

  static async create(data) {
    return BedRepository.create(data);
  }

  static async update(id, data) {
    return BedRepository.update(id, data);
  }

  static async delete(id) {
    return BedRepository.delete(id);
  }
}

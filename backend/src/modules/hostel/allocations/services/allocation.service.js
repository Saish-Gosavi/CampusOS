import { AllocationRepository } from "../repository/allocation.repository.js";

export class AllocationService {
  static async getAll() {
    return AllocationRepository.findAll();
  }

  static async getById(id) {
    return AllocationRepository.findById(id);
  }

  static async create(data) {
    return AllocationRepository.create(data);
  }

  static async update(id, data) {
    return AllocationRepository.update(id, data);
  }

  static async delete(id) {
    return AllocationRepository.delete(id);
  }
}

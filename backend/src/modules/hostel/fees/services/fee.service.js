import { FeeRepository } from "../repository/fee.repository.js";

export class FeeService {
  static async getAll() {
    return FeeRepository.findAll();
  }

  static async getById(id) {
    return FeeRepository.findById(id);
  }

  static async create(data) {
    return FeeRepository.create(data);
  }

  static async update(id, data) {
    return FeeRepository.update(id, data);
  }

  static async delete(id) {
    return FeeRepository.delete(id);
  }
}

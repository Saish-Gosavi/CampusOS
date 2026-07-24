import { VisitorRepository } from "../repository/visitor.repository.js";

export class VisitorService {
  static async getAll() {
    return VisitorRepository.findAll();
  }

  static async getById(id) {
    return VisitorRepository.findById(id);
  }

  static async create(data) {
    return VisitorRepository.create(data);
  }

  static async update(id, data) {
    return VisitorRepository.update(id, data);
  }

  static async delete(id) {
    return VisitorRepository.delete(id);
  }
}

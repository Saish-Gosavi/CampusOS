import { LeaveRepository } from "../repository/leave.repository.js";

export class LeaveService {
  static async getAll() {
    return LeaveRepository.findAll();
  }

  static async getById(id) {
    return LeaveRepository.findById(id);
  }

  static async create(data) {
    return LeaveRepository.create(data);
  }

  static async update(id, data) {
    return LeaveRepository.update(id, data);
  }

  static async delete(id) {
    return LeaveRepository.delete(id);
  }
}

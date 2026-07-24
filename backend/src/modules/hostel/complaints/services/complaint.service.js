import { ComplaintRepository } from "../repository/complaint.repository.js";

export class ComplaintService {
  static async getAll() {
    return ComplaintRepository.findAll();
  }

  static async getById(id) {
    return ComplaintRepository.findById(id);
  }

  static async create(data) {
    return ComplaintRepository.create(data);
  }

  static async update(id, data) {
    return ComplaintRepository.update(id, data);
  }

  static async delete(id) {
    return ComplaintRepository.delete(id);
  }
}

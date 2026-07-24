import { HostelRepository } from "../repository/hostel.repository.js";

export class HostelService {
  static async getAll() {
    return HostelRepository.findAll();
  }

  static async getById(id) {
    return HostelRepository.findById(id);
  }

  static async create(data) {
    return HostelRepository.create(data);
  }

  static async update(id, data) {
    return HostelRepository.update(id, data);
  }

  static async delete(id) {
    return HostelRepository.delete(id);
  }

  static async createAdminForCollege(hostelId, adminData) {
    return HostelRepository.createAdminForCollege(hostelId, adminData);
  }

  static async deleteAdminFromCollege(userId) {
    return HostelRepository.deleteAdminFromCollege(userId);
  }
}

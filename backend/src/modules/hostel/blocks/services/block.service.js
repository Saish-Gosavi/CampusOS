import { BlockRepository } from "../repository/block.repository.js";

export class BlockService {
  static async getAll() {
    return BlockRepository.findAll();
  }

  static async getById(id) {
    return BlockRepository.findById(id);
  }

  static async create(data) {
    return BlockRepository.create(data);
  }

  static async update(id, data) {
    return BlockRepository.update(id, data);
  }

  static async delete(id) {
    return BlockRepository.delete(id);
  }
}

import { RoomRepository } from "../repository/room.repository.js";

export class RoomService {
  static async getAll(floorId) {
    return RoomRepository.findAll(floorId);
  }

  static async getById(id) {
    return RoomRepository.findById(id);
  }

  static async create(data) {
    return RoomRepository.create(data);
  }

  static async update(id, data) {
    return RoomRepository.update(id, data);
  }

  static async delete(id) {
    return RoomRepository.delete(id);
  }
}

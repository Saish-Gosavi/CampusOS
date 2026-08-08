import { MessRepository } from "../repository/mess.repository.js";

export class MessService {
  static async getMessDashboard() {
    const stats = await MessRepository.getStats();
    const menu = await MessRepository.getMenu();

    const attendance = await MessRepository.getAttendance();
    const feedback = await MessRepository.getFeedback();
    const inventory = await MessRepository.getInventory();

    return {
      stats,
      menu,

      attendance,
      feedback,
      inventory
    };
  }

  static async getMenu() {
    return MessRepository.getMenu();
  }

  static async updateMenu(day, mealType, menuText) {
    return MessRepository.updateMenu(day, mealType, menuText);
  }



  static async getAttendance() {
    return MessRepository.getAttendance();
  }

  static async getFeedback() {
    return MessRepository.getFeedback();
  }

  static async getInventory() {
    return MessRepository.getInventory();
  }

  static async updateInventory(id, quantity, status) {
    return MessRepository.updateInventory(id, quantity, status);
  }

  static async createInventoryItem(data) {
    return MessRepository.createInventoryItem(data);
  }
}

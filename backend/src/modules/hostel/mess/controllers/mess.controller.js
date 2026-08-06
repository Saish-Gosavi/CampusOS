import { MessService } from "../services/mess.service.js";
import { apiResponse } from "../../../../helpers/response.helper.js";

export class MessController {
  static async getDashboard(req, res, next) {
    try {
      const data = await MessService.getMessDashboard();
      return apiResponse.success(res, data, "Mess dashboard details retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getMenu(req, res, next) {
    try {
      const menu = await MessService.getMenu();
      return apiResponse.success(res, menu, "Weekly mess menu retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async updateMenu(req, res, next) {
    try {
      const { day, mealType, menuText } = req.body;
      const updated = await MessService.updateMenu(day, mealType, menuText);
      return apiResponse.success(res, updated, "Mess menu updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getRebates(req, res, next) {
    try {
      const rebates = await MessService.getRebates();
      return apiResponse.success(res, rebates, "Mess rebate requests retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async updateRebateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await MessService.updateRebateStatus(id, status);
      return apiResponse.success(res, updated, `Rebate request marked as ${status}`);
    } catch (error) {
      next(error);
    }
  }

  static async getAttendance(req, res, next) {
    try {
      const logs = await MessService.getAttendance();
      return apiResponse.success(res, logs, "Mess attendance logs retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async getFeedback(req, res, next) {
    try {
      const reviews = await MessService.getFeedback();
      return apiResponse.success(res, reviews, "Mess feedback & ratings retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async getInventory(req, res, next) {
    try {
      const items = await MessService.getInventory();
      return apiResponse.success(res, items, "Mess inventory items retrieved");
    } catch (error) {
      next(error);
    }
  }

  static async updateInventory(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity, status } = req.body;
      const updated = await MessService.updateInventory(id, quantity, status);
      return apiResponse.success(res, updated, "Mess inventory item updated");
    } catch (error) {
      next(error);
    }
  }

  static async createInventoryItem(req, res, next) {
    try {
      const item = await MessService.createInventoryItem(req.body);
      return apiResponse.created(res, item, "New inventory item added successfully");
    } catch (error) {
      next(error);
    }
  }
}

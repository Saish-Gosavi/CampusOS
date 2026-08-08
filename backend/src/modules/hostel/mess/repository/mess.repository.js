// Pre-seeded Mess Store with rich realistic data for Warden Mess Management

let weeklyMenu = [];



let messAttendance = [];

let messFeedback = [];

let messInventory = [];

export class MessRepository {
  static async getStats() {
    const todayMealsServed = 0;
    const totalStudentsEnrolled = 142;
    const attendanceRate = "0%";

    const lowStockCount = messInventory.filter(i => i.status !== "Optimal").length;
    const avgRating = 0;

    return {
      todayMealsServed,
      totalStudentsEnrolled,
      attendanceRate,

      lowStockCount,
      avgRating
    };
  }

  static async getMenu() {
    return weeklyMenu;
  }

  static async updateMenu(day, mealType, menuText) {
    const dayItem = weeklyMenu.find(m => m.day.toLowerCase() === day.toLowerCase());
    if (dayItem && mealType && dayItem[mealType.toLowerCase()] !== undefined) {
      dayItem[mealType.toLowerCase()] = menuText;
    }
    return weeklyMenu;
  }



  static async getAttendance() {
    return messAttendance;
  }

  static async getFeedback() {
    return messFeedback;
  }

  static async getInventory() {
    return messInventory;
  }

  static async updateInventory(id, quantity, status) {
    const item = messInventory.find(i => i.id === Number(id));
    if (item) {
      if (quantity !== undefined) item.quantity = Number(quantity);
      if (status) item.status = status;
      item.lastRestocked = new Date().toISOString().split("T")[0];
    }
    return item;
  }

  static async createInventoryItem(data) {
    const newItem = {
      id: messInventory.length + 1,
      name: data.name,
      category: data.category || "General",
      quantity: Number(data.quantity) || 0,
      unit: data.unit || "kg",
      minThreshold: Number(data.minThreshold) || 10,
      status: Number(data.quantity) <= Number(data.minThreshold || 10) ? "Low Stock" : "Optimal",
      lastRestocked: new Date().toISOString().split("T")[0]
    };
    messInventory.push(newItem);
    return newItem;
  }
}

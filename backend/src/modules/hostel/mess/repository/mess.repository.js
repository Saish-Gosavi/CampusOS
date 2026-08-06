// Pre-seeded Mess Store with rich realistic data for Warden Mess Management

let weeklyMenu = [
  { day: "Monday", breakfast: "Poha, Tea/Coffee, Boiled Eggs, Sprouts", lunch: "Roti, Rice, Dal Tadka, Paneer Butter Masala, Curd, Salad", snacks: "Samosa, Tea/Coffee", dinner: "Roti, Veg Pulao, Rajma, Mixed Veg, Gulab Jamun" },
  { day: "Tuesday", breakfast: "Idli Sambhar, Coconut Chutney, Fruit", lunch: "Roti, Rice, Chana Dal, Aloo Gobi, Buttermilk", snacks: "Biscuits, Tea/Coffee", dinner: "Roti, Rice, Chicken Curry / Shahi Paneer, Kheer" },
  { day: "Wednesday", breakfast: "Upma, Sev, Tea/Coffee, Bananas", lunch: "Roti, Rice, Moong Dal, Baingan Bharta, Papad", snacks: "Bread Pakora, Tea", dinner: "Roti, Veg Biryani, Mirchi Ka Salan, Raita" },
  { day: "Thursday", breakfast: "Aloo Paratha, Curd, Pickle, Tea", lunch: "Roti, Rice, Dal Makhani, Bhindi Fry, Sweet Lassi", snacks: "Puri Bhaji, Tea", dinner: "Roti, Rice, Egg Curry / Kadhai Paneer, Halwa" },
  { day: "Friday", breakfast: "Uttapam, Sambhar, Tomato Chutney", lunch: "Roti, Rice, Yellow Dal, Chole Bhature, Salad", snacks: "Vada Pav, Tea/Coffee", dinner: "Roti, Fried Rice, Veg Manchurian, Ice Cream" },
  { day: "Saturday", breakfast: "Sandwich, Milk/Tea, Boiled Eggs", lunch: "Roti, Jeera Rice, Dal Palak, Aloo Matar, Curd", snacks: "French Fries, Tea", dinner: "Roti, Rice, Paneer Tikka Masala, Sev Tamatar, Jalebi" },
  { day: "Sunday", breakfast: "Masala Dosa, Sambhar, Chutney", lunch: "Special Feast: Veg/Non-Veg Thali, Sweet, Juice", snacks: "Pav Bhaji, Cold Drinks", dinner: "Roti, Rice, Dal Fry, Mix Veg, Fruit Custard" },
];

let messRebates = [
  { id: 1, studentId: 101, studentName: "Rahul Sharma", room: "A-204", startDate: "2026-08-01", endDate: "2026-08-05", totalDays: 5, perDayRate: 120, totalAmount: 600, reason: "Home Visit during Semester Break", status: "pending", createdAt: "2026-07-30" },
  { id: 2, studentId: 104, studentName: "Ananya Roy", room: "B-108", startDate: "2026-08-03", endDate: "2026-08-07", totalDays: 4, perDayRate: 120, totalAmount: 480, reason: "Medical Leave", status: "pending", createdAt: "2026-08-01" },
  { id: 3, studentId: 110, studentName: "Vikas Verma", room: "A-312", startDate: "2026-07-25", endDate: "2026-07-28", totalDays: 3, perDayRate: 120, totalAmount: 360, reason: "Educational Conference", status: "approved", createdAt: "2026-07-22" },
  { id: 4, studentId: 115, studentName: "Sneha Patel", room: "B-302", startDate: "2026-07-20", endDate: "2026-07-22", totalDays: 2, perDayRate: 120, totalAmount: 240, reason: "Family Event", status: "rejected", createdAt: "2026-07-18" },
];

let messAttendance = [
  { id: 101, studentName: "Rahul Sharma", rollNo: "ST2024-001", room: "A-204", mealType: "Breakfast", scanTime: "08:15 AM", status: "Present" },
  { id: 102, studentName: "Priya Singh", rollNo: "ST2024-002", room: "B-102", mealType: "Breakfast", scanTime: "08:22 AM", status: "Present" },
  { id: 103, studentName: "Amit Kumar", rollNo: "ST2024-003", room: "A-105", mealType: "Breakfast", scanTime: "08:40 AM", status: "Present" },
  { id: 104, studentName: "Ananya Roy", rollNo: "ST2024-004", room: "B-108", mealType: "Lunch", scanTime: "12:35 PM", status: "Present" },
  { id: 105, studentName: "Siddharth Gupta", rollNo: "ST2024-005", room: "A-301", mealType: "Lunch", scanTime: "01:05 PM", status: "Present" },
  { id: 106, studentName: "Kavita Rao", rollNo: "ST2024-006", room: "B-210", mealType: "Dinner", scanTime: "08:10 PM", status: "Present" },
];

let messFeedback = [
  { id: 1, studentName: "Siddharth Gupta", room: "A-301", rating: 5, meal: "Lunch", category: "Quality", comment: "Paneer Butter Masala was delicious today!", date: "2026-08-06" },
  { id: 2, studentName: "Priya Singh", room: "B-102", rating: 3, meal: "Breakfast", category: "Temperature", comment: "Tea was cold during 8:30 AM batch.", date: "2026-08-06" },
  { id: 3, studentName: "Amit Kumar", room: "A-105", rating: 4, meal: "Dinner", category: "Hygiene", comment: "Cleanliness around serving area was good.", date: "2026-08-05" },
  { id: 4, studentName: "Kavita Rao", room: "B-210", rating: 2, meal: "Lunch", category: "Quantity", comment: "Roti counter line was very slow.", date: "2026-08-05" },
];

let messInventory = [
  { id: 1, name: "Wheat Flour (Atta)", category: "Grains", quantity: 250, unit: "kg", minThreshold: 100, status: "Optimal", lastRestocked: "2026-08-01" },
  { id: 2, name: "Basmati Rice", category: "Grains", quantity: 180, unit: "kg", minThreshold: 80, status: "Optimal", lastRestocked: "2026-08-02" },
  { id: 3, name: "Toor Dal", category: "Pulses", quantity: 35, unit: "kg", minThreshold: 50, status: "Low Stock", lastRestocked: "2026-07-20" },
  { id: 4, name: "Sunflower Cooking Oil", category: "Oils", quantity: 60, unit: "Liters", minThreshold: 40, status: "Optimal", lastRestocked: "2026-08-03" },
  { id: 5, name: "Fresh Milk", category: "Dairy", quantity: 15, unit: "Liters", minThreshold: 30, status: "Restock Needed", lastRestocked: "2026-08-05" },
  { id: 6, name: "LPG Gas Cylinders", category: "Fuel", quantity: 8, unit: "Cylinders", minThreshold: 4, status: "Optimal", lastRestocked: "2026-07-28" },
];

export class MessRepository {
  static async getStats() {
    const todayMealsServed = 420;
    const totalStudentsEnrolled = 142;
    const attendanceRate = "94%";
    const pendingRebatesCount = messRebates.filter(r => r.status === "pending").length;
    const lowStockCount = messInventory.filter(i => i.status !== "Optimal").length;
    const avgRating = (messFeedback.reduce((acc, f) => acc + f.rating, 0) / messFeedback.length).toFixed(1);

    return {
      todayMealsServed,
      totalStudentsEnrolled,
      attendanceRate,
      pendingRebatesCount,
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

  static async getRebates() {
    return messRebates;
  }

  static async updateRebateStatus(id, status) {
    const rebate = messRebates.find(r => r.id === Number(id));
    if (rebate) {
      rebate.status = status;
    }
    return rebate;
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

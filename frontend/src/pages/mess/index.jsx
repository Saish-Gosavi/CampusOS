import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Users,
  Clock,
  Star,
  Package,
  Calendar,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { messApi } from "@/services/api";

const Route = {
  head: () => ({
    meta: [
      { title: "Mess Operations Dashboard — CampusOS" },
      { name: "description", content: "Mess Manager Dashboard for meal scheduling and dining operations." }
    ]
  }),
  component: MessDashboardPage
};

function MessDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledStudents: 142,
    mealsServedToday: 420,
    offDaysToday: 2,
    avgRating: 4.5,
    lowStockItems: 2
  });

  const [todaysMenu, setTodaysMenu] = useState({
    day: "Today",
    breakfast: "Idli, Sambar, Coconut Chutney, Tea / Coffee",
    lunch: "Paneer Butter Masala, Dal Tadka, Steamed Rice, Chapati, Salad",
    snacks: "Veg Samosa, Mint Chutney, Tea",
    dinner: "Veg Biryani, Boondi Raita, Gulab Jamun"
  });

  const [offDays, setOffDays] = useState([
    { id: 1, studentName: "Rahul Sharma", room: "A-102", startDate: "2026-08-07", endDate: "2026-08-09", totalDays: 3, reason: "Home visit for weekend" },
    { id: 2, studentName: "Priya Patel", room: "B-204", startDate: "2026-08-07", endDate: "2026-08-08", totalDays: 2, reason: "Family event" }
  ]);

  const [lowStock, setLowStock] = useState([
    { id: 1, itemName: "Toor Dal (Tuvar)", currentStock: 12, unit: "kg", threshold: 25 },
    { id: 2, itemName: "Fresh Cow Milk", currentStock: 8, unit: "Liters", threshold: 20 }
  ]);

  const [editMealModal, setEditMealModal] = useState(null);
  const [editMenuText, setEditMenuText] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await messApi.getDashboardStats();
      if (res.success && res.data) {
        if (res.data.stats) setStats(prev => ({ ...prev, ...res.data.stats }));
        if (res.data.todaysMenu) setTodaysMenu(res.data.todaysMenu);
        if (res.data.rebates) setOffDays(res.data.rebates);
      }
    } catch (e) {
      console.warn("Using default mess dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMealText = () => {
    if (!editMealModal) return;
    setTodaysMenu(prev => ({
      ...prev,
      [editMealModal]: editMenuText
    }));
    toast.success(`Updated ${editMealModal} menu!`);
    setEditMealModal(null);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 p-6 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur">
              Dining Hall Operations
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Mess Manager Dashboard</h1>
          <p className="text-xs text-amber-200/90">Manage weekly meal menus, student dining off-day notifications, and kitchen stock inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/mess/menu"
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-400 transition-all shadow-sm"
          >
            <Calendar className="h-4 w-4" /> Edit Weekly Menu
          </Link>
        </div>
      </div>

      {/* 5 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stat 1 */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Meals Served Today</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{stats.mealsServedToday}</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +8%
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Breakfast, Lunch & Dinner</p>
        </div>

        {/* Stat 2 */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Mess Enrolled Students</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{stats.enrolledStudents}</span>
            <span className="text-[11px] font-medium text-muted-foreground">Active</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Hostel dining subscribers</p>
        </div>

        {/* Stat 3 */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Not Coming Today</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-700">{offDays.length}</span>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Off-Days</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Students notified non-attendance</p>
        </div>

        {/* Stat 4 */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Overall Food Rating</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/10 text-purple-600">
              <Star className="h-4 w-4 fill-purple-600" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{stats.avgRating} / 5</span>
            <span className="text-[11px] font-semibold text-purple-600">⭐ Excellent</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Based on student feedback</p>
        </div>

        {/* Stat 5 */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Stock Reorder Alerts</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/10 text-rose-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-600">{lowStock.length}</span>
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Action Needed</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Items below threshold</p>
        </div>
      </div>

      {/* Today's Meal Plan Card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">Today's Dining Meal Plan</h3>
            <p className="text-xs text-muted-foreground">Menu served in hostel dining hall today</p>
          </div>
          <Link
            to="/mess/menu"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            View Full Week Schedule →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Breakfast */}
          <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                07:30 AM - 09:30 AM
              </span>
              <button
                onClick={() => {
                  setEditMealModal("breakfast");
                  setEditMenuText(todaysMenu.breakfast);
                }}
                className="rounded p-1 text-muted-foreground hover:text-amber-700 hover:bg-muted"
                title="Quick Edit"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Breakfast</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{todaysMenu.breakfast}</p>
          </div>

          {/* Lunch */}
          <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                12:30 PM - 02:30 PM
              </span>
              <button
                onClick={() => {
                  setEditMealModal("lunch");
                  setEditMenuText(todaysMenu.lunch);
                }}
                className="rounded p-1 text-muted-foreground hover:text-amber-700 hover:bg-muted"
                title="Quick Edit"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Lunch</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{todaysMenu.lunch}</p>
          </div>

          {/* Evening Snacks */}
          <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                05:00 PM - 06:00 PM
              </span>
              <button
                onClick={() => {
                  setEditMealModal("snacks");
                  setEditMenuText(todaysMenu.snacks);
                }}
                className="rounded p-1 text-muted-foreground hover:text-amber-700 hover:bg-muted"
                title="Quick Edit"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Evening Snacks</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{todaysMenu.snacks}</p>
          </div>

          {/* Dinner */}
          <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                07:30 PM - 09:30 PM
              </span>
              <button
                onClick={() => {
                  setEditMealModal("dinner");
                  setEditMenuText(todaysMenu.dinner);
                }}
                className="rounded p-1 text-muted-foreground hover:text-amber-700 hover:bg-muted"
                title="Quick Edit"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Dinner</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{todaysMenu.dinner}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Off-Days & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Off-Days Preview */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Students Not Coming Today</h3>
              <p className="text-xs text-muted-foreground">Logged off-days notifications for headcount planning</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              Total: {offDays.length} Students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-2.5 font-semibold">Student</th>
                  <th className="p-2.5 font-semibold">Room</th>
                  <th className="p-2.5 font-semibold">Period</th>
                  <th className="p-2.5 font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {offDays.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="p-2.5 font-medium text-foreground">{r.studentName}</td>
                    <td className="p-2.5 text-muted-foreground">{r.room}</td>
                    <td className="p-2.5 text-muted-foreground">{r.startDate} → {r.endDate}</td>
                    <td className="p-2.5 text-muted-foreground truncate max-w-[140px]">{r.reason}</td>
                  </tr>
                ))}
                {offDays.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                      All students are attending mess today!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-right">
            <Link to="/mess/off-days" className="text-xs font-semibold text-amber-700 hover:underline">
              View All Off-Day Logs →
            </Link>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Ration Stock Reorder Alerts</h3>
              <p className="text-xs text-muted-foreground">Items nearing low stock threshold</p>
            </div>
            <Link to="/mess/inventory" className="text-xs font-semibold text-amber-700 hover:underline">
              Manage Inventory →
            </Link>
          </div>

          <div className="space-y-3">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-rose-100 text-rose-700">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">{item.itemName}</h5>
                    <p className="text-[11px] text-muted-foreground">
                      Current Stock: <span className="font-semibold text-rose-700">{item.currentStock} {item.unit}</span> (Min Threshold: {item.threshold} {item.unit})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setLowStock(prev => prev.map(i => i.id === item.id ? { ...i, currentStock: i.currentStock + 50 } : i));
                    toast.success(`Restocked 50 ${item.unit} of ${item.itemName}`);
                  }}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
                >
                  + Restock 50
                </button>
              </div>
            ))}
            {lowStock.length === 0 && (
              <div className="py-6 text-center text-xs text-muted-foreground">
                All ration stock items are well above safety thresholds!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Meal Modal */}
      {editMealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground capitalize">Edit Today's {editMealModal} Menu</h3>
              <button onClick={() => setEditMealModal(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Dishes (comma separated)</label>
              <textarea
                value={editMenuText}
                onChange={(e) => setEditMenuText(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditMealModal(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-medium hover:bg-muted">Cancel</button>
              <button onClick={handleSaveMealText} className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700">Save Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessDashboardPage;
export { Route };

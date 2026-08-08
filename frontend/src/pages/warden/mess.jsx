import { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  UtensilsCrossed,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
  AlertTriangle,
  Plus,
  RefreshCw,
  Edit3,
  Loader2,
  Package,
  TrendingUp,
  Clock,
  Check,
  Filter
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/hostel/StatusPill";
import { messApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/warden/mess")({
  component: WardenMessManagement
});

function WardenMessManagement() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("menu"); // "menu", "rebates", "feedback", "inventory"

  // Modals state
  const [editMenuModal, setEditMenuModal] = useState(null); // { day, mealType, text }
  const [addInventoryModal, setAddInventoryModal] = useState(false);
  const [inventoryForm, setInventoryForm] = useState({ name: "", category: "Grains", quantity: "", unit: "kg", minThreshold: "10" });
  const [submitting, setSubmitting] = useState(false);


  const [selectedDay, setSelectedDay] = useState("Monday");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await messApi.getDashboard();
      const payload = res.data || res;
      setData(payload);
    } catch (err) {
      console.error("Failed to fetch mess data:", err);
      toast.error(err?.message || "Failed to load mess management details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRebateStatus = async (id, status) => {
    try {
      await messApi.updateRebateStatus(id, status);
      toast.success(`Mess rebate request ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err?.message || "Failed to update rebate status");
    }
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    if (!editMenuModal) return;
    setSubmitting(true);
    try {
      await messApi.updateMenu(editMenuModal.day, editMenuModal.mealType, editMenuModal.text);
      toast.success(`Updated ${editMenuModal.mealType} menu for ${editMenuModal.day}`);
      setEditMenuModal(null);
      fetchData();
    } catch (err) {
      toast.error(err?.message || "Failed to update menu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    if (!inventoryForm.name.trim() || !inventoryForm.quantity) {
      return toast.error("Please fill in item name and quantity");
    }
    setSubmitting(true);
    try {
      await messApi.createInventoryItem(inventoryForm);
      toast.success(`Added ${inventoryForm.name} to mess stock`);
      setAddInventoryModal(false);
      setInventoryForm({ name: "", category: "Grains", quantity: "", unit: "kg", minThreshold: "10" });
      fetchData();
    } catch (err) {
      toast.error(err?.message || "Failed to add inventory item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestockInventory = async (id, currentQty) => {
    try {
      const newQty = Number(currentQty) + 50;
      await messApi.updateInventory(id, newQty, "Optimal");
      toast.success("Stock quantity updated successfully");
      fetchData();
    } catch (err) {
      toast.error("Failed to update stock");
    }
  };

  const stats = data?.stats || {
    todayMealsServed: 420,
    totalStudentsEnrolled: 142,
    attendanceRate: "94%",
    pendingRebatesCount: 2,
    lowStockCount: 2,
    avgRating: "4.5"
  };

  const statCards = [
    { label: "Today's Meals", value: String(stats.todayMealsServed), delta: "Breakfast, Lunch, Dinner", trend: "up", icon: UtensilsCrossed, tint: "#2563EB" },
    { label: "Mess Residents", value: String(stats.totalStudentsEnrolled), delta: "Active subscribers", trend: "up", icon: Users, tint: "#7B4CED" },
    { label: "Turnout Rate", value: String(stats.attendanceRate), delta: "Dining attendance", trend: "up", icon: TrendingUp, tint: "#22C55E" },
    { label: "Pending Off-Days", value: String(stats.pendingRebatesCount), delta: "Requests to review", trend: "down", icon: Clock, tint: "#F97316" },
    { label: "Food Rating", value: `${stats.avgRating} / 5.0`, delta: "Student reviews", trend: "up", icon: Star, tint: "#EAB308" },
    { label: "Stock Alerts", value: String(stats.lowStockCount), delta: "Below min threshold", trend: "down", icon: Package, tint: "#EF4444" }
  ];

  const weeklyMenu = data?.menu || [];
  const rebates = data?.rebates || [];

  const feedback = data?.feedback || [];
  const inventory = data?.inventory || [];



  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <UtensilsCrossed className="h-7 w-7 text-primary" /> Mess & Dining Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor weekly meal menus, mess attendance, student rebate applications, ration stock, and food quality ratings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex h-56 items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="h-7 w-7 animate-spin text-primary mr-3" />
          <span className="text-sm font-medium text-muted-foreground">Loading Mess Management dashboard...</span>
        </div>
      ) : (
        <>
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "menu", label: "Weekly Meal Menu", icon: Calendar, badge: null },
              { id: "rebates", label: "Mess Off-Day Notifications", icon: Clock, badge: `${rebates.length} Not Coming` },

              { id: "feedback", label: "Food Quality & Ratings", icon: Star, badge: null }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    active
                      ? "bg-primary text-white font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge && (
                    <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Weekly Meal Menu */}
          {activeTab === "menu" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Weekly Mess Menu Schedule</h3>
                  <p className="text-xs text-muted-foreground">Hostel dining schedule for Breakfast, Lunch, Snacks, and Dinner</p>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedDay === day
                          ? "bg-purple-600 text-white font-semibold"
                          : "bg-card border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Detailed Card */}
              {(() => {
                const savedMenuStr = typeof window !== "undefined" ? localStorage.getItem("campus_mess_weekly_menu") : null;
                const savedMenu = savedMenuStr ? JSON.parse(savedMenuStr) : null;
                const currentDaySlots = savedMenu ? (savedMenu[selectedDay] || []) : null;

                if (currentDaySlots) {
                  return (
                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                            {selectedDay.slice(0, 3)}
                          </span>
                          <h4 className="text-lg font-bold text-foreground">{selectedDay} Meal Plan</h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {currentDaySlots.map((m) => (
                          <div key={m.id} className="rounded-xl border border-border bg-background p-4 relative group hover:border-primary/50 transition-colors space-y-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {m.time}
                              </span>
                            </div>
                            <h5 className="text-sm font-semibold text-foreground">{m.name}</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">{m.dishes}</p>
                          </div>
                        ))}
                        {currentDaySlots.length === 0 && (
                          <div className="col-span-full py-8 text-center text-xs text-muted-foreground">
                            No meal slots scheduled for {selectedDay}.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return weeklyMenu.filter(m => m.day === selectedDay).map((m) => (
                  <div key={m.day} className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                          {m.day.slice(0, 3)}
                        </span>
                        <h4 className="text-lg font-bold text-foreground">{m.day} Meal Plan</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            07:30 AM - 09:30 AM
                          </span>
                        </div>
                        <h5 className="text-sm font-semibold text-foreground mb-1">Breakfast</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">{m.breakfast}</p>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            12:30 PM - 02:30 PM
                          </span>
                        </div>
                        <h5 className="text-sm font-semibold text-foreground mb-1">Lunch</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">{m.lunch}</p>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                            05:00 PM - 06:00 PM
                          </span>
                        </div>
                        <h5 className="text-sm font-semibold text-foreground mb-1">Evening Snacks</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">{m.snacks}</p>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            07:30 PM - 09:30 PM
                          </span>
                        </div>
                        <h5 className="text-sm font-semibold text-foreground mb-1">Dinner</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">{m.dinner}</p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}

          {/* Tab 2: Mess Off-Day Notifications */}
          {activeTab === "rebates" && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Student Mess Off-Day Notifications</h3>
                  <p className="text-xs text-muted-foreground">List of students who notified they will not be attending mess meals</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2 shadow-xs">
                  <span className="text-xs font-medium text-amber-800">Total Not Coming Today:</span>
                  <span className="text-sm font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                    {rebates.length} Students
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-3 font-semibold">Student Name</th>
                      <th className="p-3 font-semibold">Room</th>
                      <th className="p-3 font-semibold">Off-Day Period</th>
                      <th className="p-3 font-semibold">Total Days</th>
                      <th className="p-3 font-semibold">Reason / Note</th>
                      <th className="p-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rebates.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium text-foreground">{r.studentName}</td>
                        <td className="p-3 text-muted-foreground">{r.room}</td>
                        <td className="p-3 text-muted-foreground">{r.startDate} → {r.endDate}</td>
                        <td className="p-3 font-medium text-foreground">{r.totalDays} Days</td>
                        <td className="p-3 text-muted-foreground max-w-xs truncate">{r.reason}</td>
                        <td className="p-3 text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                            ● Notified (Not Coming)
                          </span>
                        </td>
                      </tr>
                    ))}
                    {rebates.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          All students are attending mess today (0 off-days logged)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {/* Tab 4: Food Quality & Ratings */}
          {activeTab === "feedback" && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Student Mess Feedback & Food Quality Reviews</h3>
                  <p className="text-xs text-muted-foreground">Ratings and comments submitted by dining residents</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.map((f) => (
                  <div key={f.id} className="rounded-xl border border-border bg-background p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{f.studentName} ({f.room})</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {f.rating} / 5
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-0.5">{f.meal}</span>
                      <span className="rounded bg-purple-50 text-purple-700 px-2 py-0.5 font-medium">{f.category}</span>
                      <span>· {f.date}</span>
                    </div>
                    <p className="text-xs text-foreground italic mt-1 bg-card p-2.5 rounded-lg border border-border">
                      "{f.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Menu Modal */}
          {editMenuModal && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setEditMenuModal(null)}>
              <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="text-sm font-bold text-foreground">
                    Update {editMenuModal.mealType.toUpperCase()} Menu ({editMenuModal.day})
                  </h3>
                  <button onClick={() => setEditMenuModal(null)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveMenu} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Dishes & Menu Items</label>
                    <textarea
                      required
                      rows={4}
                      value={editMenuModal.text}
                      onChange={(e) => setEditMenuModal({ ...editMenuModal, text: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-3 text-xs outline-none focus:border-primary"
                      placeholder="e.g. Roti, Rice, Dal Fry, Shahi Paneer, Sweet"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditMenuModal(null)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium">Cancel</button>
                    <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90">
                      {submitting ? "Saving..." : "Save Menu"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { Route };

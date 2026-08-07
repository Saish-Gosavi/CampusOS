import React, { useState } from "react";
import { Calendar, Edit3, Save, Plus, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

const Route = {
  head: () => ({
    meta: [
      { title: "Weekly Meal Menu — Mess Manager" },
      { name: "description", content: "Weekly mess dining schedule management." }
    ]
  }),
  component: MessMenuPage
};

const initialMenuData = {
  Monday: [
    { id: "mon_1", name: "Breakfast", time: "07:30 AM - 09:30 AM", dishes: "Poha, Jalebi, Tea" },
    { id: "mon_2", name: "Lunch", time: "12:30 PM - 02:30 PM", dishes: "Rajma Masala, Rice, Chapati, Salad" },
    { id: "mon_3", name: "Evening Snacks", time: "05:00 PM - 06:00 PM", dishes: "Samosa, Tea" },
    { id: "mon_4", name: "Dinner", time: "07:30 PM - 09:30 PM", dishes: "Aloo Gobi, Dal Fry, Roti, Rice" }
  ],
  Tuesday: [
    { id: "tue_1", name: "Breakfast", time: "07:30 AM - 09:30 AM", dishes: "Idli, Sambhar, Coconut Chutney" },
    { id: "tue_2", name: "Lunch", time: "12:30 PM - 02:30 PM", dishes: "Chole Bhature, Boondi Raita, Rice" },
    { id: "tue_3", name: "Evening Snacks", time: "05:00 PM - 06:00 PM", dishes: "Kachori, Coffee" },
    { id: "tue_4", name: "Dinner", time: "07:30 PM - 09:30 PM", dishes: "Bhindi Masala, Yellow Dal, Chapati" }
  ],
  Wednesday: [
    { id: "wed_1", name: "Breakfast", time: "07:30 AM - 09:30 AM", dishes: "Aloo Paratha, Curd, Pickle" },
    { id: "wed_2", name: "Lunch", time: "12:30 PM - 02:30 PM", dishes: "Paneer Butter Masala, Veg Pulao, Naan" },
    { id: "wed_3", name: "Evening Snacks", time: "05:00 PM - 06:00 PM", dishes: "Bread Pakora, Tea" },
    { id: "wed_4", name: "Dinner", time: "07:30 PM - 09:30 PM", dishes: "Veg Kolhapuri, Dal Makhani, Rice" }
  ],
  Thursday: [
    { id: "thu_1", name: "Breakfast", time: "07:30 AM - 09:30 AM", dishes: "Uttapam, Sambhar, Chutney" },
    { id: "thu_2", name: "Lunch", time: "12:30 PM - 02:30 PM", dishes: "Kadhi Pakoda, Jeera Rice, Chapati" },
    { id: "thu_3", name: "Evening Snacks", time: "05:00 PM - 06:00 PM", dishes: "Veg Cutlet, Tea" },
    { id: "thu_4", name: "Dinner", time: "07:30 PM - 09:30 PM", dishes: "Mix Veg, Chana Dal, Roti, Rice" }
  ],
  Friday: [
    { id: "fri_1", name: "Breakfast", time: "07:30 AM - 09:30 AM", dishes: "Upma, Sev, Banana, Coffee" },
    { id: "fri_2", name: "Lunch", time: "12:30 PM - 02:30 PM", dishes: "Dum Aloo, Matar Pulao, Puri, Raita" },
    { id: "fri_3", name: "Evening Snacks", time: "05:00 PM - 06:00 PM", dishes: "Biscuits, Tea" },
    { id: "fri_4", name: "Dinner", time: "07:30 PM - 09:30 PM", dishes: "Dal Tadka, Sev Tamatar, Chapati, Rice" }
  ],
  Saturday: [
    { id: "sat_1", name: "Breakfast", time: "07:30 AM - 09:30 AM", dishes: "Puri Bhaji, Sweet Lassi" },
    { id: "sat_2", name: "Lunch", time: "12:30 PM - 02:30 PM", dishes: "Soyabean Curry, Rice, Chapati" },
    { id: "sat_3", name: "Evening Snacks", time: "05:00 PM - 06:00 PM", dishes: "Dhokla, Green Chutney" },
    { id: "sat_4", name: "Dinner", time: "07:30 PM - 09:30 PM", dishes: "Pav Bhaji, Pulao, Gulab Jamun" }
  ],
  Sunday: [
    { id: "sun_1", name: "Breakfast", time: "07:30 AM - 09:30 AM", dishes: "Masala Dosa, Sambhar, Chutney" },
    { id: "sun_2", name: "Lunch", time: "12:30 PM - 02:30 PM", dishes: "Special Veg Thali, Paneer Kadhai, Sweet" },
    { id: "sun_3", name: "Evening Snacks", time: "05:00 PM - 06:00 PM", dishes: "French Fries, Cold Drink" },
    { id: "sun_4", name: "Dinner", time: "07:30 PM - 09:30 PM", dishes: "Egg Curry / Malai Kofta, Veg Biryani" }
  ]
};

const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function MessMenuPage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [weeklyMenu, setWeeklyMenu] = useState(initialMenuData);

  // Edit Modal State
  const [editingMeal, setEditingMeal] = useState(null); // meal object
  const [formName, setFormName] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formDishes, setFormDishes] = useState("");

  // Add Modal State
  const [addModal, setAddModal] = useState(false);
  const [newMealName, setNewMealName] = useState("Breakfast");
  const [newMealTime, setNewMealTime] = useState("07:30 AM - 09:30 AM");
  const [newMealDishes, setNewMealDishes] = useState("");

  const activeDayMeals = weeklyMenu[selectedDay] || [];

  const handleOpenEdit = (meal) => {
    setEditingMeal(meal);
    setFormName(meal.name);
    setFormTime(meal.time);
    setFormDishes(meal.dishes);
  };

  const handleSaveEdit = () => {
    if (!editingMeal) return;
    setWeeklyMenu((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((m) =>
        m.id === editingMeal.id
          ? { ...m, name: formName, time: formTime, dishes: formDishes }
          : m
      )
    }));
    toast.success(`Updated ${formName} for ${selectedDay}!`);
    setEditingMeal(null);
  };

  const handleDeleteMeal = (id, name) => {
    setWeeklyMenu((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((m) => m.id !== id)
    }));
    toast.success(`Deleted ${name} slot from ${selectedDay}`);
    setEditingMeal(null);
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMealName || !newMealDishes) {
      toast.error("Meal name and dishes are required!");
      return;
    }
    const newSlot = {
      id: `meal_${Date.now()}`,
      name: newMealName,
      time: newMealTime,
      dishes: newMealDishes
    };
    setWeeklyMenu((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newSlot]
    }));
    toast.success(`Added ${newMealName} slot to ${selectedDay}!`);
    setAddModal(false);
    setNewMealDishes("");
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Mess Meal Menu Schedule</h1>
          <p className="text-xs text-muted-foreground">Manage and publish weekly dining menus, meal slots, and timings for all 7 days</p>
        </div>
        <button
          onClick={() => toast.success("Weekly meal schedule saved & published to students!")}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Save className="h-4 w-4" /> Save & Publish Schedule
        </button>
      </div>

      {/* Days Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {daysList.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
              selectedDay === day
                ? "bg-primary text-white shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Selected Day Detailed Meal Schedule */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white font-bold text-base">
              {selectedDay.slice(0, 3)}
            </span>
            <div>
              <h3 className="text-lg font-bold text-foreground">{selectedDay} Dining Schedule</h3>
              <p className="text-xs text-muted-foreground">Configured meal slots ({activeDayMeals.length} slots active)</p>
            </div>
          </div>
          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <Plus className="h-4 w-4 text-primary" /> Add Meal Slot
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeDayMeals.map((m) => (
            <div key={m.id} className="rounded-xl border border-border bg-background p-4 relative group hover:border-primary/50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {m.time}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="rounded p-1 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    title="Edit Meal Slot & Timing"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMeal(m.id, m.name)}
                    className="rounded p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Meal Slot"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <h4 className="text-sm font-bold text-foreground">{m.name}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.dishes}</p>
            </div>
          ))}

          {activeDayMeals.length === 0 && (
            <div className="col-span-full py-10 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              No meal slots configured for {selectedDay}. Click "+ Add Meal Slot" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Edit Meal Slot & Timing Modal */}
      {editingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground capitalize">Edit {selectedDay} Meal Slot</h3>
              <button onClick={() => setEditingMeal(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground">Meal Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground">Meal Timing</label>
                <input
                  type="text"
                  placeholder="e.g. 07:30 AM - 09:30 AM"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground">Dishes (comma separated)</label>
                <textarea
                  value={formDishes}
                  onChange={(e) => setFormDishes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleDeleteMeal(editingMeal.id, editingMeal.name)}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Meal Slot
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingMeal(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-medium hover:bg-muted">Cancel</button>
                <button type="button" onClick={handleSaveEdit} className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Meal Slot Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form onSubmit={handleAddMeal} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Add New Meal Slot to {selectedDay}</h3>
              <button type="button" onClick={() => setAddModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground">Meal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Breakfast, High Tea, Late Dinner..."
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground">Meal Timing *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 07:30 AM - 09:30 AM"
                  value={newMealTime}
                  onChange={(e) => setNewMealTime(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-muted-foreground">Dishes (comma separated) *</label>
                <textarea
                  required
                  placeholder="e.g. Masala Dosa, Sambhar, Coconut Chutney, Coffee"
                  value={newMealDishes}
                  onChange={(e) => setNewMealDishes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAddModal(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-medium hover:bg-muted">Cancel</button>
              <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90">Add Meal Slot</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MessMenuPage;
export { Route };

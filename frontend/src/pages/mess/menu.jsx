import React, { useState } from "react";
import { Calendar, Edit3, Save, RotateCcw } from "lucide-react";
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

function MessMenuPage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [weeklyMenu, setWeeklyMenu] = useState([
    { day: "Monday", breakfast: "Poha, Jalebi, Tea", lunch: "Rajma Masala, Rice, Chapati, Salad", snacks: "Samosa, Tea", dinner: "Aloo Gobi, Dal Fry, Roti, Rice" },
    { day: "Tuesday", breakfast: "Idli, Sambhar, Coconut Chutney", lunch: "Chole Bhature, Boondi Raita, Rice", snacks: "Kachori, Coffee", dinner: "Bhindi Masala, Yellow Dal, Chapati" },
    { day: "Wednesday", breakfast: "Aloo Paratha, Curd, Pickle", lunch: "Paneer Butter Masala, Veg Pulao, Naan", snacks: "Bread Pakora, Tea", dinner: "Veg Kolhapuri, Dal Makhani, Rice" },
    { day: "Thursday", breakfast: "Uttapam, Sambhar, Chutney", lunch: "Kadhi Pakoda, Jeera Rice, Chapati", snacks: "Veg Cutlet, Tea", dinner: "Mix Veg, Chana Dal, Roti, Rice" },
    { day: "Friday", breakfast: "Upma, Sev, Banana, Coffee", lunch: "Dum Aloo, Matar Pulao, Puri, Raita", snacks: "Biscuits, Tea", dinner: "Dal Tadka, Sev Tamatar, Chapati, Rice" },
    { day: "Saturday", breakfast: "Puri Bhaji, Sweet Lassi", lunch: "Soyabean Curry, Rice, Chapati", snacks: "Dhokla, Green Chutney", dinner: "Pav Bhaji, Pulao, Gulab Jamun" },
    { day: "Sunday", breakfast: "Masala Dosa, Sambhar, Chutney", lunch: "Special Veg Thali, Paneer Kadhai, Sweet", snacks: "French Fries, Cold Drink", dinner: "Egg Curry / Malai Kofta, Veg Biryani" }
  ]);

  const [editingMeal, setEditingMeal] = useState(null);
  const [mealText, setMealText] = useState("");

  const activeDaySchedule = weeklyMenu.find(m => m.day === selectedDay);

  const handleUpdateMeal = () => {
    if (!editingMeal) return;
    setWeeklyMenu(prev => prev.map(m => m.day === selectedDay ? { ...m, [editingMeal]: mealText } : m));
    toast.success(`Updated ${selectedDay} ${editingMeal} menu!`);
    setEditingMeal(null);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Mess Meal Menu Schedule</h1>
          <p className="text-xs text-muted-foreground">Manage and publish weekly dining menus for all 7 days</p>
        </div>
        <button
          onClick={() => toast.success("Weekly meal schedule saved & published to students!")}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors shadow-sm"
        >
          <Save className="h-4 w-4" /> Save & Publish Schedule
        </button>
      </div>

      {/* Days Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {weeklyMenu.map((m) => (
          <button
            key={m.day}
            onClick={() => setSelectedDay(m.day)}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
              selectedDay === m.day
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {m.day}
          </button>
        ))}
      </div>

      {/* Selected Day Detailed Meal Cards */}
      {activeDaySchedule && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-600 text-white font-bold text-base">
                {activeDaySchedule.day.slice(0, 3)}
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">{activeDaySchedule.day} Dining Schedule</h3>
                <p className="text-xs text-muted-foreground">Breakfast, Lunch, Evening Snacks, and Dinner</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Breakfast */}
            <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-amber-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  07:30 AM - 09:30 AM
                </span>
                <button
                  onClick={() => {
                    setEditingMeal("breakfast");
                    setMealText(activeDaySchedule.breakfast);
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-amber-700 hover:bg-muted"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Breakfast</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeDaySchedule.breakfast}</p>
            </div>

            {/* Lunch */}
            <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-amber-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  12:30 PM - 02:30 PM
                </span>
                <button
                  onClick={() => {
                    setEditingMeal("lunch");
                    setMealText(activeDaySchedule.lunch);
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-amber-700 hover:bg-muted"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Lunch</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeDaySchedule.lunch}</p>
            </div>

            {/* Evening Snacks */}
            <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-amber-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  05:00 PM - 06:00 PM
                </span>
                <button
                  onClick={() => {
                    setEditingMeal("snacks");
                    setMealText(activeDaySchedule.snacks);
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-amber-700 hover:bg-muted"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Evening Snacks</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeDaySchedule.snacks}</p>
            </div>

            {/* Dinner */}
            <div className="rounded-xl border border-border bg-background p-4 relative group hover:border-amber-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  07:30 PM - 09:30 PM
                </span>
                <button
                  onClick={() => {
                    setEditingMeal("dinner");
                    setMealText(activeDaySchedule.dinner);
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-amber-700 hover:bg-muted"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Dinner</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeDaySchedule.dinner}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground capitalize">Edit {selectedDay} {editingMeal} Menu</h3>
              <button onClick={() => setEditingMeal(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Dishes (comma separated)</label>
              <textarea
                value={mealText}
                onChange={(e) => setMealText(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingMeal(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-medium hover:bg-muted">Cancel</button>
              <button onClick={handleUpdateMeal} className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessMenuPage;
export { Route };

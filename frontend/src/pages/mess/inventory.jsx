import React, { useState } from "react";
import { Package, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Route = {
  head: () => ({
    meta: [
      { title: "Ration Inventory — Mess Manager" },
      { name: "description", content: "Mess kitchen raw materials & stock inventory management." }
    ]
  }),
  component: MessInventoryPage
};

function MessInventoryPage() {
  const [inventory, setInventory] = useState([
    { id: 1, itemName: "Basmati Rice", category: "Grains", quantity: 240, unit: "kg", minThreshold: 50, lastRestocked: "2026-08-01" },
    { id: 2, itemName: "Wheat Flour (Atta)", category: "Grains", quantity: 180, unit: "kg", minThreshold: 40, lastRestocked: "2026-08-02" },
    { id: 3, itemName: "Toor Dal (Tuvar)", category: "Pulses", quantity: 12, unit: "kg", minThreshold: 25, lastRestocked: "2026-07-28" },
    { id: 4, itemName: "Refined Sunflower Oil", category: "Oils", quantity: 95, unit: "Liters", minThreshold: 30, lastRestocked: "2026-08-03" },
    { id: 5, itemName: "Fresh Cow Milk", category: "Dairy", quantity: 8, unit: "Liters", minThreshold: 20, lastRestocked: "2026-08-06" },
    { id: 6, itemName: "LPG Commercial Cylinders", category: "Fuel", quantity: 6, unit: "Cylinders", minThreshold: 2, lastRestocked: "2026-07-30" }
  ]);

  const [addModal, setAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: "", category: "Grains", quantity: "", unit: "kg", minThreshold: "20" });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.itemName || !newItem.quantity) {
      toast.error("Item name and quantity are required!");
      return;
    }
    const created = {
      id: Date.now(),
      itemName: newItem.itemName,
      category: newItem.category,
      quantity: Number(newItem.quantity),
      unit: newItem.unit,
      minThreshold: Number(newItem.minThreshold),
      lastRestocked: new Date().toISOString().split("T")[0]
    };
    setInventory([created, ...inventory]);
    toast.success(`Added ${newItem.itemName} to ration inventory!`);
    setAddModal(false);
    setNewItem({ itemName: "", category: "Grains", quantity: "", unit: "kg", minThreshold: "20" });
  };

  const handleRestock = (id, amount) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + amount, lastRestocked: new Date().toISOString().split("T")[0] } : i));
    toast.success(`Restocked item successfully!`);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kitchen Ration & Provision Inventory</h1>
          <p className="text-xs text-muted-foreground">Track kitchen raw materials, stock balances, and reorder levels</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Provision Stock
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-3 font-semibold">Item Name</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Current Stock</th>
                <th className="p-3 font-semibold">Min Threshold</th>
                <th className="p-3 font-semibold">Last Restocked</th>
                <th className="p-3 font-semibold text-center">Stock Level</th>
                <th className="p-3 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventory.map((item) => {
                const isLow = item.quantity <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-semibold text-foreground">{item.itemName}</td>
                    <td className="p-3 text-muted-foreground">{item.category}</td>
                    <td className="p-3 font-bold text-foreground">{item.quantity} {item.unit}</td>
                    <td className="p-3 text-muted-foreground">{item.minThreshold} {item.unit}</td>
                    <td className="p-3 text-muted-foreground">{item.lastRestocked}</td>
                    <td className="p-3 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                          <AlertTriangle className="h-3 w-3" /> Reorder Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Optimal
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRestock(item.id, 50)}
                        className="rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-200"
                      >
                        + Restock 50
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form onSubmit={handleAddItem} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Add Provision Stock Item</h3>
              <button type="button" onClick={() => setAddModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mustard Seeds, Sugar, Ghee..."
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                    <option value="Oils">Oils</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fuel">Fuel</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground">Unit</label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground">Initial Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground">Reorder Threshold</label>
                  <input
                    type="number"
                    value={newItem.minThreshold}
                    onChange={(e) => setNewItem({ ...newItem, minThreshold: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAddModal(false)} className="rounded-xl border border-border px-4 py-2 font-medium hover:bg-muted">Cancel</button>
              <button type="submit" className="rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700">Add Stock</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MessInventoryPage;
export { Route };

import React from "react";
import { createFileRoute } from "@/routes/compat";
import {
  Package,
  AlertTriangle,
  ClipboardList,
  ClipboardCheck,
  ArrowRightLeft,
  PackagePlus,
  Truck,
  BookUp,
  Megaphone
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";

const Route = createFileRoute("/inventory-admin/")({
  component: InventoryDashboard
});

const stats = [
  { label: "Total Items", value: "0", delta: "Registered Items", trend: "up", icon: Package, tint: "#2563EB" },
  { label: "Low Stock", value: "0", delta: "Reorder Required", trend: "down", icon: AlertTriangle, tint: "#EAB308" },
  { label: "Pending Requests", value: "0", delta: "Procurement Requests", trend: "down", icon: ClipboardList, tint: "#7B4CED" },
  { label: "Approved Requests", value: "0", delta: "Approved Orders", trend: "up", icon: ClipboardCheck, tint: "#22C55E" },
  { label: "Borrowed Items", value: "0", delta: "Active Borrowings", trend: "up", icon: ArrowRightLeft, tint: "#3B82F6" },
  { label: "Vendors", value: "0", delta: "Registered Suppliers", trend: "up", icon: Truck, tint: "#0D9488" }
];

const quickActions = [
  { title: "Add Item", description: "Register a new inventory item", icon: PackagePlus, tint: "#2563EB" },
  { title: "Approve Request", description: "Review pending procurement", icon: ClipboardCheck, tint: "#22C55E" },
  { title: "Receive Goods", description: "Create a goods receipt note", icon: Truck, tint: "#7B4CED" },
  { title: "Issue Item", description: "Lend an item to a department", icon: BookUp, tint: "#EAB308" },
  { title: "Create Notice", description: "Broadcast to departments", icon: Megaphone, tint: "#EF4444" }
];

function InventoryDashboard() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Inventory Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Stock levels, procurement pipeline and borrowings across the campus.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          Inventory module active
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Common procurement and stock tasks</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickActions.map((a) => (
            <QuickActionCard key={a.title} {...a} />
          ))}
        </div>
      </section>

      <ChartCard title="Inventory Overview" description="Procurement pipeline and category breakdown">
        <div className="flex h-48 flex-col items-center justify-center text-center p-4 text-muted-foreground">
          <Package className="h-10 w-10 stroke-[1.5] mb-2 opacity-40 text-primary" />
          <p className="text-sm font-medium text-foreground">No Stock Items Registered</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
            Add items to your inventory to track stock levels and procurement pipelines.
          </p>
        </div>
      </ChartCard>
    </div>
  );
}

export { Route };

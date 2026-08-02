import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { StatCard } from "@/components/admin/StatCard";
import { Building2, Users, DoorClosed, BookOpen, Package } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: CollegeAdminDashboard
});

function CollegeAdminDashboard() {
  const { user } = useAuth();
  const collegeName = user?.college?.name || "Your College";

  const stats = [
    { label: "Total Students", value: "0", delta: "Enrolled", trend: "up", icon: Users, tint: "#2563EB" },
    { label: "Total Hostels", value: "0", delta: "Active Blocks", trend: "up", icon: DoorClosed, tint: "#7B4CED" },
    { label: "Library Books", value: "0", delta: "Available", trend: "up", icon: BookOpen, tint: "#0D9488" },
    { label: "Inventory Items", value: "0", delta: "In Stock", trend: "up", icon: Package, tint: "#EA580C" }
  ];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Dashboard" }]} />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name || "College Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of {collegeName} operations and metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
        <Building2 className="mx-auto h-12 w-12 opacity-20 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">College Admin Portal</h3>
        <p className="mt-2 text-sm max-w-md mx-auto">
          Welcome to the new unified College Administration Dashboard. From here you can manage hostels, library, inventory, and staff for your campus.
        </p>
      </div>
    </div>
  );
}

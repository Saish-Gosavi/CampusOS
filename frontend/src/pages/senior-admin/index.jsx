import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Home,
  BookOpen,
  Package,
  AlertCircle,
  CheckCircle2,
  Users,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi } from "@/services/api";

const Route = createFileRoute("/senior-admin/")({
  component: DashboardPage
});

function DashboardPage() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await dashboardApi.getSuperAdminStats();
        if (res.success && res.data) {
          setStatsData(res.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard statistics", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Aggregating campus records...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name || "Senior Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user?.collegeName ? `${user.collegeName} Operations Panel` : "Senior administrative overview and college module allocations."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            All systems operational
          </span>
        </div>
      </div>

      {/* Facilities Modules Grid */}
      <div className="flex flex-col gap-6">
        {/* 1. Hostel Management */}
        <ModuleSection
          title="Hostel Management"
          icon={Home}
          color="purple"
          admin={statsData?.hostelAdmin}
          metrics={[
            { label: "Total Rooms", value: statsData?.hostel?.totalRooms },
            { label: "Occupied Rooms", value: statsData?.hostel?.occupiedRooms },
            { label: "Active Complaints", value: statsData?.hostel?.complaints },
            { label: "Active Leaves", value: statsData?.hostel?.activeLeaves }
          ]}
        />

        {/* 2. Library Management */}
        <ModuleSection
          title="Library Management"
          icon={BookOpen}
          color="blue"
          admin={statsData?.libraryAdmin}
          metrics={[
            { label: "Total Cataloged Books", value: statsData?.library?.totalBooks },
            { label: "Active Issued Copies", value: statsData?.library?.activeIssues },
            { label: "Overdue Books", value: statsData?.library?.overdueBooks }
          ]}
        />

        {/* 3. Inventory Management */}
        <ModuleSection
          title="Inventory/Store Management"
          icon={Package}
          color="emerald"
          admin={statsData?.inventoryAdmin}
          metrics={[
            { label: "Total Items", value: statsData?.inventory?.totalItems },
            { label: "Pending Requests", value: statsData?.inventory?.pendingRequests },
            { label: "Approved Requests", value: statsData?.inventory?.approvedRequests }
          ]}
        />
      </div>
    </div>
  );
}

function ModuleSection({ title, icon: Icon, color, admin, metrics }) {
  const theme = {
    purple: { bg: "bg-purple-500/10", border: "border-purple-200 dark:border-purple-900/50", text: "text-purple-600 dark:text-purple-400" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-200 dark:border-blue-900/50", text: "text-blue-600 dark:text-blue-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-900/50", text: "text-emerald-600 dark:text-emerald-400" }
  }[color];

  return (
    <div className={`rounded-xl border ${theme.border} bg-card p-6 shadow-sm`}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Module details & Admin state */}
        <div className="flex flex-col gap-4 lg:col-span-1 pr-6 lg:border-r lg:border-border">
          <div className="flex items-center gap-3">
            <span className={`grid h-10 w-10 place-items-center rounded-lg ${theme.bg} ${theme.text}`}>
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>

          <div className="mt-2">
            {admin ? (
              <div className="rounded-lg bg-muted/40 p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-sans">Admin Assigned</span>
                </div>
                <div className="text-sm font-medium text-foreground font-sans">{admin.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-sans">{admin.email}</div>
              </div>
            ) : (
              <div className="rounded-lg bg-red-500/5 p-4 border border-red-500/10 flex gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-red-500 font-sans">Unassigned</div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium font-sans">
                    Admin has not been created yet
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Statistics report or placeholder */}
        <div className="flex flex-col justify-center lg:col-span-2 pl-0 lg:pl-6">
          {admin ? (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 font-sans">Module Reports & Statistics</div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {metrics.map((m, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-muted/10 p-4 shadow-sm">
                    <div className="text-sm text-muted-foreground font-medium font-sans">{m.label}</div>
                    <div className="text-2xl font-bold text-foreground mt-1.5 font-sans">{m.value ?? 0}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/10 rounded-lg border border-dashed border-border h-full">
              <AlertCircle className="h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-muted-foreground font-sans">Reports locked</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm font-sans">
                Onboard the sector administrator in the Admins management tab to enable operational metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Route };

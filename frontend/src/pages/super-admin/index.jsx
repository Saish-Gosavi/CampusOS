import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  UserCog,
  ShieldCheck,
  ArrowRight,
  Users,
  GraduationCap,
  Activity as ActivityIcon,
  ServerCog,
  BookOpen,
  Package
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { EmptyChart } from "@/components/admin/EmptyChart";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi } from "@/services/api";

const Route = createFileRoute("/super-admin/")({
  component: DashboardPage
});

const PIE_COLORS = ["#2563EB", "#7B4CED", "#3B82F6", "#22C55E", "#EAB308"];

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

  const statIcons = [Building2, UserCog, ShieldCheck, GraduationCap, Users, ActivityIcon];
  const statTints = ["#2563EB", "#7B4CED", "#3B82F6", "#EAB308", "#22C55E", "#22C55E"];

  const superAdminStats = statsData?.stats
    ? statsData.stats.map((s, i) => ({
        ...s,
        icon: statIcons[i % statIcons.length],
        tint: statTints[i % statTints.length],
      }))
    : [
        { label: "Total Colleges", value: "—", delta: "Loading…", trend: "up", icon: Building2, tint: "#2563EB" },
        { label: "Total Admins", value: "—", delta: "Loading…", trend: "up", icon: UserCog, tint: "#7B4CED" },
        { label: "System Roles", value: "—", delta: "Loading…", trend: "up", icon: ShieldCheck, tint: "#3B82F6" },
        { label: "Total Students", value: "—", delta: "Loading…", trend: "up", icon: GraduationCap, tint: "#EAB308" },
        { label: "Active Users (24h)", value: "—", delta: "Loading…", trend: "up", icon: Users, tint: "#22C55E" },
        { label: "Platform Uptime", value: "—", delta: "Loading…", trend: "up", icon: ActivityIcon, tint: "#22C55E" }
      ];

  // Real data only — empty arrays when nothing in DB
  const moduleUsageData = statsData?.moduleUsage ?? [];
  const adminDistributionData = (statsData?.adminDistribution ?? []).filter(d => d.value > 0);
  const cityDistributionData = statsData?.cityDistribution ?? [];
  const recentHostels = statsData?.recentHostels ?? [];
  const recentActivity = (statsData?.recentActivity ?? []).map((log, i) => ({
    id: String(log.id ?? i),
    title: log.action,
    meta: `${log.module} — ${log.description?.slice(0, 50) ?? ""}`,
    time: log.createdAt ? new Date(log.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "",
    icon: log.module === "Hostel" ? Building2 : log.module === "Library" ? BookOpen : log.module === "Inventory" ? Package : ServerCog,
    tint: log.module === "Hostel" ? "#7B4CED" : log.module === "Library" ? "#3B82F6" : log.module === "Inventory" ? "#22C55E" : "#EAB308"
  }));

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Dashboard" }]} />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name || "Super Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Platform-wide overview across every campus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            All systems operational
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {superAdminStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts row 1 — Platform Usage + Admins by Module */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Platform Usage"
          description="Activity across modules (last 6 months)"
        >
          <div className="h-72">
            {moduleUsageData.length === 0 ? (
              <EmptyChart message="No activity recorded yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moduleUsageData} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="Hostel" stroke="#7B4CED" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Library" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Inventory" stroke="#22C55E" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Admins by Module" description="Distribution of module administrators">
          <div className="h-72">
            {adminDistributionData.length === 0 ? (
              <EmptyChart message="No module admins created yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adminDistributionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {adminDistributionData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 — Colleges by City + System Health */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Colleges by City" description="Institutional footprint">
          <div className="h-64">
            {cityDistributionData.length === 0 ? (
              <EmptyChart message="No colleges added yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityDistributionData} layout="vertical" margin={{ top: 5, right: 12, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12
                    }}
                  />
                  <Bar dataKey="value" fill="#7B4CED" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard title="System Health" description="Service status snapshot">
          <ul className="divide-y divide-border">
            {[
              { name: "API Gateway", status: "Operational", tint: "#22C55E" },
              { name: "Database", status: "Operational", tint: "#22C55E" },
              { name: "Auth Service", status: "Operational", tint: "#22C55E" },
              { name: "File Storage", status: "Operational", tint: "#22C55E" },
              { name: "Background Jobs", status: "Operational", tint: "#22C55E" }
            ].map((s) => (
              <li key={s.name} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <ServerCog className="h-4 w-4 text-muted-foreground" />
                  {s.name}
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${s.tint}1A`, color: s.tint }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.tint }} />
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      {/* Recent Colleges + Recent Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Recent Colleges"
          description="Latest institutions onboarded"
          action={
            <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          {recentHostels.length === 0 ? (
            <EmptyChart message="No colleges onboarded yet." />
          ) : (
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-2 py-2 font-medium">Name</th>
                    <th className="px-2 py-2 font-medium">City</th>
                    <th className="px-2 py-2 font-medium">Blocks</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentHostels.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-muted/40">
                      <td className="whitespace-nowrap px-2 py-2.5 font-medium text-foreground">{r.name}</td>
                      <td className="whitespace-nowrap px-2 py-2.5 text-foreground">{r.city || "—"}</td>
                      <td className="whitespace-nowrap px-2 py-2.5 text-foreground">{r.blocks?.length ?? 0}</td>
                      <td className="px-2 py-2.5">
                        <StatusPill status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Recent Activity"
          description="Latest platform-level events"
          action={
            <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          {recentActivity.length === 0 ? (
            <EmptyChart message="No activity logged yet." />
          ) : (
            <ActivityTimeline items={recentActivity} />
          )}
        </ChartCard>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Active: { bg: "#22C55E1A", fg: "#16A34A" },
    Pending: { bg: "#EAB3081A", fg: "#B45309" },
    Inactive: { bg: "#EF44441A", fg: "#DC2626" }
  };
  const { bg, fg } = map[status] ?? map.Active;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: bg, color: fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fg }} />
      {status}
    </span>
  );
}

export { Route };

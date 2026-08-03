import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "react-router-dom";
import {
  UserCog,
  ShieldCheck,
  GraduationCap,
  Users,
  Activity as ActivityIcon
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
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi } from "@/services/api";
import {
  moduleUsage,
  adminDistribution
} from "@/lib/admin-data";

const Route = createFileRoute("/senior-admin/")({
  component: DashboardPage
});

const PIE_COLORS = ["#2563EB", "#7B4CED", "#3B82F6", "#22C55E", "#EAB308"];

function DashboardPage() {
  const navigate = useNavigate();
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

  const statIcons = [UserCog, ShieldCheck, GraduationCap, Users, ActivityIcon];
  const statTints = ["#7B4CED", "#3B82F6", "#EAB308", "#22C55E", "#22C55E"];

  const seniorAdminStats = statsData?.stats
    ? statsData.stats.map((s, i) => ({
        ...s,
        icon: statIcons[i % statIcons.length],
        tint: statTints[i % statTints.length],
      }))
    : [
        { label: "Total Admins",       value: "0",      delta: "Configured Staff",       trend: "up", icon: UserCog,      tint: "#7B4CED" },
        { label: "System Roles",        value: "8",      delta: "Active RBAC Scopes",     trend: "up", icon: ShieldCheck,  tint: "#3B82F6" },
        { label: "Total Students",      value: "0",      delta: "Enrolled",               trend: "up", icon: GraduationCap, tint: "#EAB308" },
        { label: "Active Users (24h)",  value: "1",      delta: "Operational Accounts",   trend: "up", icon: Users,        tint: "#22C55E" },
        { label: "Platform Uptime",     value: "99.99%", delta: "Last 30 days",           trend: "up", icon: ActivityIcon,  tint: "#22C55E" }
      ];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name || "Senior Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Senior administrative overview and college module allocations.
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
        {seniorAdminStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Platform Usage"
          description="Active sessions across modules (last 6 months)"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statsData?.moduleUsage || moduleUsage} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
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
          </div>
        </ChartCard>

        <ChartCard title="Admins by Module" description="Distribution of module administrators">
          <div className="h-72">
            {statsData?.adminDistribution && statsData.adminDistribution.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statsData.adminDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {statsData.adminDistribution.map((_, i) => (
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
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center p-4 text-muted-foreground">
                <Users className="h-10 w-10 stroke-[1.5] mb-2 opacity-40 text-primary" />
                <p className="text-sm font-medium text-foreground">No Admins Assigned Yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[210px]">
                  Onboard sector administrators from the Admins module.
                </p>
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

export { Route };

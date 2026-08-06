import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@/routes/compat";
import {
  Users,
  UtensilsCrossed,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Star,
  Loader2,
  RefreshCw
} from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { StatusPill } from "@/components/hostel/StatusPill";
import { dashboardApi, leaveApi, messApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/warden/")({
  component: WardenDashboard
});

function WardenDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [messStats, setMessStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [res, messRes] = await Promise.all([
        dashboardApi.getWardenStats(),
        messApi.getDashboard().catch(() => null)
      ]);
      const payload = res?.data || res;
      setData(payload);
      if (messRes) {
        setMessStats(messRes.data?.stats || messRes.stats || null);
      }
    } catch (err) {
      console.error("Failed to load warden dashboard:", err);
      toast.error(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateLeaveStatus = async (id, status) => {
    try {
      await leaveApi.updateStatus(id, { status, remark: `Leave ${status} by Warden` });
      toast.success(`Leave request ${status} successfully`);
      fetchStats();
    } catch (err) {
      toast.error(err?.message || `Failed to update leave status`);
    }
  };

  const wardenInfo = {
    fullName: data?.warden?.fullName || "Warden",
    hostelName: data?.warden?.hostelName || "Campus Hostel",
    blocks: Array.isArray(data?.warden?.blocks) && data.warden.blocks.length > 0
      ? data.warden.blocks
      : ["Block A", "Block B"]
  };

  const stats = data?.stats || {
    totalStudents: 142,
    pendingLeaves: 1
  };

  const statCards = [
    { label: "Mess & Hostel Residents", value: String(stats.totalStudents || 142), delta: "Active subscribers", trend: "up", icon: Users, tint: "#7B4CED" },
    { label: "Pending Leave Requests", value: String(stats.pendingLeaves || 1), delta: "Awaiting review", trend: "down", icon: CalendarDays, tint: "#F97316" },
    { label: "Today's Meals Served", value: String(messStats?.todayMealsServed || 420), delta: "Breakfast, Lunch, Dinner", trend: "up", icon: UtensilsCrossed, tint: "#2563EB" },
    { label: "Mess Food Rating", value: `${messStats?.avgRating || "4.5"} / 5.0`, delta: "Student reviews", trend: "up", icon: Star, tint: "#EAB308" }
  ];

  const quickActions = [
    { title: "Review Leave Requests", description: "Approve or reject student leave applications", icon: CalendarDays, tint: "#F97316", href: "/warden/leaves" },
    { title: "Mess Management", description: "View meal menus, attendance logs & reviews", icon: UtensilsCrossed, tint: "#2563EB", href: "/warden/mess" }
  ];

  const leaveRequestOverview = (Array.isArray(data?.leaveRequestOverview) && data.leaveRequestOverview.length > 0)
    ? data.leaveRequestOverview.map(l => ({
        ...l,
        color: l.name === "Pending" ? "#F97316" : l.name === "Approved" ? "#22C55E" : "#EF4444"
      }))
    : [
        { name: "Pending", value: stats.pendingLeaves || 1, color: "#F97316" },
        { name: "Approved", value: 15, color: "#22C55E" },
        { name: "Rejected", value: 2, color: "#EF4444" }
      ];

  const recentLeaves = Array.isArray(data?.recentLeaves) ? data.recentLeaves : [];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {wardenInfo.fullName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of student leave applications and mess dining operations for {wardenInfo.hostelName}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            Assigned: {wardenInfo.blocks.join(", ")}
          </span>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex h-56 items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="h-7 w-7 animate-spin text-primary mr-3" />
          <span className="text-sm font-medium text-muted-foreground">Loading Warden Dashboard...</span>
        </div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Quick Actions */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
              <p className="text-xs text-muted-foreground">Key operations for Warden Portal</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((a) => (
                <QuickActionCard
                  key={a.title}
                  {...a}
                  onClick={() => navigate(a.href)}
                />
              ))}
            </div>
          </section>

          {/* Leaves & Overview */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ChartCard title="Leave Requests Status" description="Distribution of leave applications">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={leaveRequestOverview} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                      {leaveRequestOverview.map((d, idx) => (
                        <Cell key={d.name || idx} fill={d.color || "#F97316"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              className="lg:col-span-2"
              title="Recent Leave Applications"
              description="Latest student leave requests awaiting review"
              action={
                <Link to="/warden/leaves" className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            >
              {recentLeaves.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">No recent leave requests</div>
              ) : (
                <ul className="divide-y divide-border">
                  {recentLeaves.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {l.student?.fullName || l.studentName || "Student"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground mt-0.5">
                          Room: {l.student?.allocations?.[0]?.bed?.room?.number || "N/A"} · Reason: {l.reason || "Leave"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusPill status={l.status || "Pending"} />
                        {l.status?.toLowerCase() === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateLeaveStatus(l.id, "approved")}
                              title="Approve"
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#22C55E]/10 text-[#16A34A] hover:bg-[#22C55E]/20"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleUpdateLeaveStatus(l.id, "rejected")}
                              title="Reject"
                              className="grid h-7 w-7 place-items-center rounded-md bg-[#EF4444]/10 text-[#DC2626] hover:bg-[#EF4444]/20"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

export { Route };

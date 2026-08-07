import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@/routes/compat";
import {
  Users,
  BedDouble,
  DoorOpen,
  MessageSquareWarning,
  Megaphone,
  ArrowRight,
  CalendarDays,
  UserCheck,
  Armchair,
  CheckCircle2,
  XCircle,
  UserPlus,
  UtensilsCrossed,
  Star,
  RefreshCw,
  Loader2
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
import { wardenStudentApi, roomApi, leaveApi, complaintApi, visitorApi, messApi, dashboardApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/warden/")({
  component: WardenDashboard
});

const quickActions = [
  { title: "Approve Leave", description: "Review pending requests", icon: CheckCircle2, tint: "#22C55E", to: "/warden/leaves" },
  { title: "Mess Management", description: "Meal menus & attendance", icon: UtensilsCrossed, tint: "#2563EB", to: "/warden/mess" },
  { title: "View Complaints", description: "Take action on tickets", icon: MessageSquareWarning, tint: "#EF4444", to: "/warden/complaints" },
  { title: "Register Visitor", description: "Log campus visitor", icon: UserPlus, tint: "#06B6D4", to: "/warden/visitors" },
  { title: "Furniture & Inspection", description: "Audit room furniture", icon: Armchair, tint: "#EAB308", to: "/warden/furniture" }
];

function WardenDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [messStats, setMessStats] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [resStudents, resRooms, resLeaves, resComplaints, resVisitors, messRes] = await Promise.allSettled([
        wardenStudentApi.getAll(),
        roomApi.getAll(),
        leaveApi.getAll(),
        complaintApi.getAll(),
        visitorApi.getAll(),
        messApi.getDashboard().catch(() => null)
      ]);

      if (resStudents.status === "fulfilled" && resStudents.value) {
        const list = resStudents.value.data || resStudents.value;
        setStudents(Array.isArray(list) ? list : []);
      }
      if (resRooms.status === "fulfilled" && resRooms.value) {
        const list = resRooms.value.data || resRooms.value;
        setRooms(Array.isArray(list) ? list : []);
      }
      if (resLeaves.status === "fulfilled" && resLeaves.value) {
        const list = resLeaves.value.data || resLeaves.value;
        setLeaves(Array.isArray(list) ? list : []);
      }
      if (resComplaints.status === "fulfilled" && resComplaints.value) {
        const list = resComplaints.value.data || resComplaints.value;
        setComplaints(Array.isArray(list) ? list : []);
      }
      if (resVisitors.status === "fulfilled" && resVisitors.value) {
        const list = resVisitors.value.data || resVisitors.value;
        setVisitors(Array.isArray(list) ? list : []);
      }
      if (messRes?.status === "fulfilled" && messRes.value) {
        setMessStats(messRes.value.data?.stats || messRes.value.stats || null);
      }
    } catch (err) {
      console.error("Failed to load warden dashboard data:", err);
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

  const totalStudents = students.length;
  const occupiedRooms = rooms.filter((r) => r.isOccupied || (r.beds && r.beds.some(b => b.allocations?.length > 0))).length;
  const availableRooms = rooms.length > 0 ? rooms.length - occupiedRooms : 0;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending" || l.status === "pending").length;
  const activeComplaints = complaints.filter((c) => c.status !== "Resolved" && c.status !== "Closed").length;
  const visitorsTodayCount = visitors.length;

  const stats = [
    { label: "Total Students", value: totalStudents.toString(), delta: "Registered Residents", trend: "up", icon: Users, tint: "#2563EB" },
    { label: "Occupied Rooms", value: occupiedRooms.toString(), delta: "Occupied", trend: "up", icon: BedDouble, tint: "#7B4CED" },
    { label: "Pending Leaves", value: pendingLeaves.toString(), delta: "Requires approval", trend: "down", icon: CalendarDays, tint: "#F97316" },
    { label: "Active Complaints", value: activeComplaints.toString(), delta: "Open tickets", trend: "down", icon: MessageSquareWarning, tint: "#EF4444" },
    { label: "Visitors Today", value: visitorsTodayCount.toString(), delta: "Check-ins", trend: "up", icon: UserCheck, tint: "#06B6D4" },
    { label: "Today's Meals Served", value: String(messStats?.todayMealsServed || 0), delta: "Mess Dining", trend: "up", icon: UtensilsCrossed, tint: "#10B981" }
  ];

  const recentLeaves = leaves.slice(0, 5);
  const recentComplaintsList = complaints.slice(0, 4);
  const recentVisitorsList = visitors.slice(0, 4);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Warden
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daily snapshot of residents, complaints, mess operations, visitors and leave requests.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
        </button>
      </div>

      {loading && students.length === 0 ? (
        <div className="flex h-56 items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="h-7 w-7 animate-spin text-primary mr-3" />
          <span className="text-sm font-medium text-muted-foreground">Loading Warden Dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
              <p className="text-xs text-muted-foreground">Frequent tasks performed daily</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {quickActions.map((a) => (
                <Link key={a.title} to={a.to}>
                  <QuickActionCard title={a.title} description={a.description} icon={a.icon} tint={a.tint} />
                </Link>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard
              title="Recent Leave Requests"
              description="Latest applications awaiting review"
              action={
                <Link to="/warden/leaves" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            >
              {recentLeaves.length > 0 ? (
                <ul className="divide-y divide-border">
                  {recentLeaves.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{l.studentName || l.student?.name || "Student"}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {l.reason || "Leave"} · {new Date(l.startDate || l.from).toLocaleDateString()} → {new Date(l.endDate || l.to).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusPill status={l.status || "Pending"} />
                        {(l.status === "Pending" || l.status === "pending") && (
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
              ) : (
                <div className="flex h-48 flex-col items-center justify-center text-center p-4 text-muted-foreground">
                  <CalendarDays className="h-9 w-9 stroke-[1.5] mb-2 opacity-40 text-primary" />
                  <p className="text-sm font-medium text-foreground">No Pending Leaves</p>
                  <p className="text-xs text-muted-foreground mt-1">Leave applications from students will appear here.</p>
                </div>
              )}
            </ChartCard>

            <ChartCard
              title="Recent Complaints"
              description="Latest tickets raised by residents"
              action={
                <Link to="/warden/complaints" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            >
              {recentComplaintsList.length > 0 ? (
                <ul className="divide-y divide-border">
                  {recentComplaintsList.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{c.title || c.subject}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.raisedBy || "Resident"} · {c.category || "General"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusPill status={c.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center text-center p-4 text-muted-foreground">
                  <MessageSquareWarning className="h-9 w-9 stroke-[1.5] mb-2 opacity-40 text-primary" />
                  <p className="text-sm font-medium text-foreground">No Active Complaints</p>
                  <p className="text-xs text-muted-foreground mt-1">Complaints submitted by hostel residents will be listed here.</p>
                </div>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

export { Route };

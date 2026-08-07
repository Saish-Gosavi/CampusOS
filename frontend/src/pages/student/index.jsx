import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@/routes/compat";
import {
  BedDouble,
  CalendarDays,
  MessageSquareWarning,
  IndianRupee,
  BookOpen,
  Clock,
  AlertTriangle,
  Bell,
  UserRoundCheck,
  Search,
  BookMarked,
  ArrowRight,
  Megaphone,
  CheckCircle2
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { StatusPill } from "@/components/hostel/StatusPill";
import { useAuth } from "@/context/AuthContext";
import { complaintApi, leaveApi, studentFeeApi } from "@/services/api";

const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Student Portal" },
      { name: "description", content: "Your hostel snapshot in one view." }
    ]
  }),
  component: StudentDashboard
});

const quickActions = [
  { title: "Apply Leave", description: "Submit a new leave request", icon: CalendarDays, tint: "#F97316", to: "/student/leaves" },
  { title: "Raise Complaint", description: "Report a hostel issue", icon: MessageSquareWarning, tint: "#EF4444", to: "/student/complaints" },
  { title: "Request Visitor Pass", description: "Invite family / guardian", icon: UserRoundCheck, tint: "#06B6D4", to: "/student/visitors" },
  { title: "View Fee Details", description: "Payments & receipts", icon: IndianRupee, tint: "#22C55E", to: "/student/fees" }
];

function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [feeReceipts, setFeeReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudentData() {
      setLoading(true);
      try {
        const [resComplaints, resLeaves, resFees] = await Promise.allSettled([
          complaintApi.getAll(),
          leaveApi.getAll(),
          studentFeeApi.getMyReceipts()
        ]);

        if (resComplaints.status === "fulfilled" && resComplaints.value) {
          const list = resComplaints.value.data || resComplaints.value;
          setComplaints(Array.isArray(list) ? list : []);
        }

        if (resLeaves.status === "fulfilled" && resLeaves.value) {
          const list = resLeaves.value.data || resLeaves.value;
          setLeaves(Array.isArray(list) ? list : []);
        }

        if (resFees.status === "fulfilled" && resFees.value) {
          const list = resFees.value.data || resFees.value;
          setFeeReceipts(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("Failed to load student dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentData();
  }, []);

  const pendingLeavesCount = leaves.filter((l) => l.status === "Pending").length;
  const pendingComplaintsCount = complaints.filter((c) => c.status !== "Resolved" && c.status !== "Closed").length;

  const stats = [
    { label: "Room Status", value: user?.roomNumber ? `Room ${user.roomNumber}` : "Unallocated", delta: user?.hostelName || "Campus Hostel", trend: "up", icon: BedDouble, tint: "#2563EB" },
    { label: "Leave Requests", value: `${pendingLeavesCount} pending`, delta: `${leaves.filter(l => l.status === "Approved").length} approved`, trend: "up", icon: CalendarDays, tint: "#F97316" },
    { label: "My Complaints", value: pendingComplaintsCount.toString(), delta: `${complaints.filter(c => c.status === "Resolved").length} resolved`, trend: "down", icon: MessageSquareWarning, tint: "#EF4444" },
    { label: "Fee Receipts", value: `${feeReceipts.length} total`, delta: "My receipts", trend: "up", icon: IndianRupee, tint: "#22C55E" }
  ];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "Student"} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.email || "Student Portal"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Quick actions</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.title} to={a.to}>
              <QuickActionCard title={a.title} description={a.description} icon={a.icon} tint={a.tint} />
            </Link>
          ))}
        </div>
      </div>

      {/* Widgets grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Complaint Status"
          description="Tickets you raised"
          action={
            <Link to="/student/complaints" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          }
        >
          {complaints.length > 0 ? (
            <ul className="space-y-3">
              {complaints.slice(0, 4).map((c) => (
                <li key={c.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{c.title || c.category}</p>
                    <StatusPill status={c.status} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                  {c.createdAt && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground">Raised {new Date(c.createdAt).toDateString()}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-44 flex-col items-center justify-center text-center p-4 text-muted-foreground">
              <CheckCircle2 className="h-9 w-9 stroke-[1.5] mb-2 opacity-40 text-emerald-500" />
              <p className="text-sm font-medium text-foreground">No Complaints Raised</p>
              <p className="text-xs text-muted-foreground mt-1">If you face any issues with hostel facilities, raise a ticket here.</p>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Leave Status"
          description="Your leave applications"
          action={
            <Link to="/student/leaves" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          }
        >
          {leaves.length > 0 ? (
            <ul className="space-y-3">
              {leaves.slice(0, 4).map((l) => (
                <li key={l.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{l.leaveType || l.reason || "Leave"}</p>
                    <StatusPill status={l.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(l.startDate || l.from).toLocaleDateString()} → {new Date(l.endDate || l.to).toLocaleDateString()}
                  </p>
                  {l.reason && <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{l.reason}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-44 flex-col items-center justify-center text-center p-4 text-muted-foreground">
              <CalendarDays className="h-9 w-9 stroke-[1.5] mb-2 opacity-40 text-primary" />
              <p className="text-sm font-medium text-foreground">No Leave Applications</p>
              <p className="text-xs text-muted-foreground mt-1">Apply for leave when traveling away from campus.</p>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

export { Route };

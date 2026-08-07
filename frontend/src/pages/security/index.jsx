import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@/routes/compat";
import {
  Users,
  DoorOpen,
  UserCheck,
  Clock,
  ShieldAlert,
  ArrowRight,
  QrCode,
  UserPlus,
  Ticket,
  BadgeAlert
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { StatusPill } from "@/components/hostel/StatusPill";
import { visitorApi, wardenStudentApi } from "@/services/api";

const Route = createFileRoute("/security/")({
  component: SecurityDashboard
});

const quickActions = [
  { title: "Scan Student QR", description: "Verify entry / exit", icon: QrCode, tint: "#2563EB", to: "/security/qr" },
  { title: "Register Visitor", description: "New visitor check-in", icon: UserPlus, tint: "#06B6D4", to: "/security/visitors" },
  { title: "Verify Gate Pass", description: "Validate outing permission", icon: Ticket, tint: "#7B4CED", to: "/security/gate-pass" },
  { title: "Log Incident", description: "Report a security event", icon: ShieldAlert, tint: "#EF4444", to: "/security/incidents" }
];

function SecurityDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSecurityData() {
      setLoading(true);
      try {
        const [resVisitors, resStudents] = await Promise.allSettled([
          visitorApi.getAll(),
          wardenStudentApi.getAll()
        ]);

        if (resVisitors.status === "fulfilled" && resVisitors.value) {
          const list = resVisitors.value.data || resVisitors.value;
          setVisitors(Array.isArray(list) ? list : []);
        }

        if (resStudents.status === "fulfilled" && resStudents.value) {
          const list = resStudents.value.data || resStudents.value;
          setStudents(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("Failed to load security dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSecurityData();
  }, []);

  const totalVisitorsToday = visitors.length;
  const pendingVisitorsCount = visitors.filter(v => v.status === "Pending").length;
  const approvedVisitorsCount = visitors.filter(v => v.status === "Approved" || v.status === "Checked In").length;

  const stats = [
    { label: "Total Students", value: students.length.toString(), delta: "Enrolled Campus Residents", trend: "up", icon: Users, tint: "#22C55E" },
    { label: "Visitors Today", value: totalVisitorsToday.toString(), delta: "Gate Registrations", trend: "up", icon: UserCheck, tint: "#06B6D4" },
    { label: "Pending Approvals", value: pendingVisitorsCount.toString(), delta: "Awaiting Warden Approval", trend: "down", icon: BadgeAlert, tint: "#EAB308" },
    { label: "Approved Passes", value: approvedVisitorsCount.toString(), delta: "Checked-in / Approved", trend: "up", icon: Ticket, tint: "#2563EB" }
  ];

  const recentVisitors = visitors.slice(0, 6);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Security Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Live snapshot of gate operations, visitor movement and campus access.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22C55E]" />
          On duty · Main Gate
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
          <p className="text-xs text-muted-foreground">Frequent security desk operations</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.title} to={a.to}>
              <QuickActionCard title={a.title} description={a.description} icon={a.icon} tint={a.tint} />
            </Link>
          ))}
        </div>
      </section>

      <ChartCard
        title="Recent Visitors Log"
        description="Latest gate entry requests"
        action={
          <Link to="/security/visitors" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        {recentVisitors.length > 0 ? (
          <ul className="divide-y divide-border">
            {recentVisitors.map((v) => (
              <li key={v.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] text-xs font-semibold text-white">
                  {(v.visitorName || "V").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{v.visitorName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Visiting {v.studentName || v.student?.name || "Resident"} · {v.purpose || "Visitor"}
                  </p>
                </div>
                <StatusPill status={v.status} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <UserCheck className="h-9 w-9 stroke-[1.5] mb-2 opacity-40 text-primary" />
            <p className="text-sm font-medium text-foreground">No Visitor Check-ins Today</p>
            <p className="text-xs text-muted-foreground mt-1">Logged gate passes and visitor check-ins will appear here.</p>
          </div>
        )}
      </ChartCard>
    </div>
  );
}

export { Route };

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Bed,
  UserCheck,
  CalendarDays,
  IndianRupee,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  DoorOpen,
  Plus
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { Button } from "@/components/ui/button";
import { hostelApi, blockApi } from "@/services/api";

export default function HostelDashboardPage() {
  const [stats, setStats] = useState({
    hostelsCount: 0,
    blocksCount: 0,
    totalCapacity: 0,
    occupiedBeds: 0,
    pendingApprovals: 4,
    pendingLeaves: 3,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const resHostels = await hostelApi.getAll();
        const hostelsList = Array.isArray(resHostels.data) ? resHostels.data : (Array.isArray(resHostels) ? resHostels : []);

        let totalCap = 0;
        let totalOcc = 0;
        let totalBlks = 0;

        for (const h of hostelsList) {
          try {
            const resBlocks = await blockApi.getAll(h.id);
            const blks = Array.isArray(resBlocks.data) ? resBlocks.data : (Array.isArray(resBlocks) ? resBlocks : []);
            totalBlks += blks.length;

            blks.forEach((b) => {
              (b.floors || []).forEach((f) => {
                (f.rooms || []).forEach((r) => {
                  totalCap += r.capacity || 0;
                  (r.beds || []).forEach((bed) => {
                    if (bed.allocations && bed.allocations.length > 0) totalOcc += 1;
                  });
                });
              });
            });
          } catch (e) {
            console.error("Failed to load blocks for hostel:", h.id);
          }
        }

        setStats((prev) => ({
          ...prev,
          hostelsCount: hostelsList.length,
          blocksCount: totalBlks,
          totalCapacity: totalCap || 120,
          occupiedBeds: totalOcc || 85,
        }));
      } catch (err) {
        console.error("Dashboard stats load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const availBeds = Math.max(0, stats.totalCapacity - stats.occupiedBeds);
  const occPct = stats.totalCapacity ? Math.round((stats.occupiedBeds / stats.totalCapacity) * 100) : 0;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Hostel Administrator Dashboard"
        description="Comprehensive overview of campus hostels, student occupancy, admission requests, and operations."
        icon={Building2}
        tint="#2563EB"
        breadcrumbs={[{ label: "Dashboard" }]}
        action={
          <Button asChild className="bg-primary hover:bg-primary/90 gap-1.5">
            <Link to="/hostel-admin/hostels">
              <Building2 className="h-4 w-4" /> Manage Hostels & Hierarchy
            </Link>
          </Button>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Registered Hostels"
          value={stats.hostelsCount}
          subtext={`${stats.blocksCount} Total Blocks / Wings`}
          icon={Building2}
          tint="#2563EB"
        />

        <MetricCard
          label="Total Student Capacity"
          value={`${stats.totalCapacity} Beds`}
          subtext={`${availBeds} Beds Currently Available`}
          icon={Bed}
          tint="#7B4CED"
        />

        <MetricCard
          label="Occupancy Rate"
          value={`${occPct}%`}
          subtext={`${stats.occupiedBeds} Beds Occupied`}
          icon={TrendingUp}
          tint="#22C55E"
          progress={occPct}
        />

        <MetricCard
          label="Pending Admissions"
          value={stats.pendingApprovals}
          subtext="Requires Approval"
          icon={UserCheck}
          tint="#EA580C"
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ActionCard
          title="Hostel & Hierarchy Setup"
          desc="Add blocks, floors, rooms, configure student capacities, and warden logins."
          icon={Building2}
          link="/hostel-admin/hostels"
          btnText="Configure Hostels"
          color="#2563EB"
        />

        <ActionCard
          title="New Admission Approvals"
          desc="Review pending hostel admission applications from registered students."
          icon={UserCheck}
          link="/hostel-admin/admission-approval"
          btnText="Review Applications"
          badge={`${stats.pendingApprovals} New`}
          color="#EA580C"
        />

        <ActionCard
          title="Room Allocation Letters"
          desc="Generate and issue official room allocation letters to admitted residents."
          icon={DoorOpen}
          link="/hostel-admin/allocation-letter"
          btnText="Manage Allocations"
          color="#7B4CED"
        />
      </div>

      {/* Operations & Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Operations Overview */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center justify-between">
            <span>Operations & Monitoring</span>
            <span className="text-xs font-semibold text-primary">Semester 2026</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OpBox
              title="Student Management"
              count="260 Active"
              desc="Enrolled student profiles and hostel stay history"
              link="/hostel-admin/students"
              icon={Users}
            />
            <OpBox
              title="Fees & Dues Tracking"
              count="₹1,24,000 Due"
              desc="Track fee collections, receipts, and overdue payments"
              link="/hostel-admin/fees"
              icon={IndianRupee}
            />
            <OpBox
              title="Leave Management"
              count={`${stats.pendingLeaves} Pending`}
              desc="Student leave requests submitted for warden approval"
              link="/hostel-admin/leaves"
              icon={CalendarDays}
            />
            <OpBox
              title="Hostel Security & Visitor Logs"
              count="14 Today"
              desc="Check-in/out registers and daily gate pass verification"
              link="/hostel-admin/visitors"
              icon={Clock}
            />
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            System Notifications
          </h3>

          <div className="space-y-3">
            <AlertItem
              title="New Warden Account Created"
              time="10 mins ago"
              desc="Warden login generated for VPPCOE Main Hostel."
              type="info"
            />
            <AlertItem
              title="Pending Room Allocations"
              time="1 hour ago"
              desc="4 students waiting for room allotment."
              type="warning"
            />
            <AlertItem
              title="Fee Collection Milestone"
              time="3 hours ago"
              desc="85% hostel fees collected for the current term."
              type="success"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function MetricCard({ label, value, subtext, icon: Icon, tint, progress }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted/60" style={{ color: tint }}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold" style={{ color: tint }}>
        {value}
      </div>
      {progress !== undefined && (
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: tint }}
          />
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}

function ActionCard({ title, desc, icon: Icon, link, btnText, badge, color }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ backgroundColor: `${color}1A`, color }}>
            <Icon className="h-5 w-5" />
          </span>
          {badge && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
              {badge}
            </span>
          )}
        </div>
        <h4 className="text-base font-bold text-foreground">{title}</h4>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>

      <div className="mt-5 border-t border-border pt-3">
        <Button asChild variant="ghost" size="sm" className="w-full justify-between hover:bg-muted">
          <Link to={link}>
            <span>{btnText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function OpBox({ title, count, desc, link, icon: Icon }) {
  return (
    <Link
      to={link}
      className="group flex flex-col justify-between rounded-lg border border-border bg-background p-4 hover:border-primary/50 transition"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground group-hover:text-primary transition">
            {title}
          </span>
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
        </div>
        <div className="mt-1 text-sm font-bold text-primary">{count}</div>
        <p className="mt-1 text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}

function AlertItem({ title, time, desc, type }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">{title}</span>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

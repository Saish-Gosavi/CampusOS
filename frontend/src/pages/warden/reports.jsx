import React, { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { BarChart3, Users, BedDouble, MessageSquareWarning, UserRoundCheck, Armchair, Download, FileSpreadsheet, FileType } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { Button } from "@/components/ui/button";
import { wardenStudentApi, roomApi, complaintApi, visitorApi } from "@/services/api";

const Route = createFileRoute("/warden/reports")({
  component: ReportsPage
});

const TINT = "#0EA5E9";

function ReportsPage() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReportsData() {
      setLoading(true);
      try {
        const [resStudents, resRooms, resComplaints, resVisitors] = await Promise.allSettled([
          wardenStudentApi.getAll(),
          roomApi.getAll(),
          complaintApi.getAll(),
          visitorApi.getAll()
        ]);

        if (resStudents.status === "fulfilled" && resStudents.value) {
          const list = resStudents.value.data || resStudents.value;
          setStudents(Array.isArray(list) ? list : []);
        }

        if (resRooms.status === "fulfilled" && resRooms.value) {
          const list = resRooms.value.data || resRooms.value;
          setRooms(Array.isArray(list) ? list : []);
        }

        if (resComplaints.status === "fulfilled" && resComplaints.value) {
          const list = resComplaints.value.data || resComplaints.value;
          setComplaints(Array.isArray(list) ? list : []);
        }

        if (resVisitors.status === "fulfilled" && resVisitors.value) {
          const list = resVisitors.value.data || resVisitors.value;
          setVisitors(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("Failed to load reports data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReportsData();
  }, []);

  const totalStudents = students.length;
  const totalBeds = rooms.reduce((acc, r) => acc + (r.beds?.length || r.capacity || 1), 0);
  const occupiedBeds = rooms.reduce((acc, r) => {
    const occ = r.beds ? r.beds.filter(b => b.allocations && b.allocations.length > 0).length : (r.isOccupied ? (r.capacity || 1) : 0);
    return acc + occ;
  }, 0);
  const occupancyPct = totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const pendingComplaints = complaints.filter(c => c.status !== "Resolved" && c.status !== "Closed").length;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Reports & Analytics"
        description="Analytics across occupancy, complaints, visitors, and hostel operations."
        icon={BarChart3}
        tint={TINT}
        breadcrumbs={[{ label: "Reports" }]}
        action={
          <div className="flex gap-2">
            <Button variant="outline"><FileType className="mr-1.5 h-4 w-4" /> PDF</Button>
            <Button variant="outline"><FileSpreadsheet className="mr-1.5 h-4 w-4" /> Excel</Button>
            <Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90"><Download className="mr-1.5 h-4 w-4" /> Download Report</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={String(totalStudents)} delta="Resident Students" trend="up" icon={Users} tint="#2563EB" />
        <StatCard label="Occupancy %" value={`${occupancyPct}%`} delta={`${occupiedBeds}/${totalBeds} Beds Utilised`} trend="up" icon={BedDouble} tint="#7B4CED" />
        <StatCard label="Pending Complaints" value={String(pendingComplaints)} delta="Active Tickets" trend="down" icon={MessageSquareWarning} tint="#EF4444" />
        <StatCard label="Visitors Today" value={String(visitors.length)} delta="Registered Visitors" trend="up" icon={UserRoundCheck} tint="#06B6D4" />
      </div>

      <ChartCard title="Hostel Reports Overview" description="Summary of occupancy and operational metrics">
        <div className="flex h-48 flex-col items-center justify-center text-center p-4 text-muted-foreground">
          <BarChart3 className="h-10 w-10 stroke-[1.5] mb-2 opacity-40 text-primary" />
          <p className="text-sm font-medium text-foreground">Live Analytics Active</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
            Data is dynamically compiled from registered residents, rooms, complaints, and visitor logs.
          </p>
        </div>
      </ChartCard>
    </div>
  );
}

export { Route };

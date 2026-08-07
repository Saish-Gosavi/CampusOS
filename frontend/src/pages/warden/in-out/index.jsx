import React, { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { Search, ArrowRightLeft } from "lucide-react";
import { InOutTable } from "@/components/warden/in-out/InOutTable";
import { NewLogDialog } from "@/components/warden/in-out/NewLogDialog";
import axios from "axios";

const Route = createFileRoute("/warden/in-out")({
  component: WardenInOutRegisterPage
});

function WardenInOutRegisterPage() {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDirection, setFilterDirection] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/warden/inout", { withCredentials: true });
      if (res.data.success && Array.isArray(res.data.data)) {
        setLogs(res.data.data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Failed to load warden logs:", err);
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAddLog = async (newLog) => {
    try {
      const res = await axios.post("http://localhost:5000/api/warden/inout", newLog, { withCredentials: true });
      if (res.data.success) {
        fetchLogs();
      }
    } catch (err) {
      console.error("Failed to post warden log:", err);
      setLogs((prev) => [newLog, ...prev]);
    }
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (l.reason && l.reason.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDirection = filterDirection === "All" || l.direction === filterDirection;
    const matchesType = filterType === "All" || l.userType === filterType;
    
    return matchesSearch && matchesDirection && matchesType;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
            In Out Register
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor real-time entry and exit logs for students, staff, and visitors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NewLogDialog onAddLog={handleAddLog} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs by name or reason..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="All">All Types</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
              <option value="Visitor">Visitor</option>
            </select>
            <select
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="All">All Directions</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          </div>
        </div>

        <InOutTable logs={filteredLogs} />
      </div>
    </div>
  );
}

export default WardenInOutRegisterPage;
export { Route };

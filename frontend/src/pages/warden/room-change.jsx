import { useEffect, useState, useMemo } from "react";
import { createFileRoute } from "@/routes/compat";
import { ArrowRightLeft, Search } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { wardenRoomChangeApi } from "@/services/api";
import { RoomChangeActionModal } from "@/components/warden/RoomChangeActionModal";

export const Route = createFileRoute("/warden/room-change")({
  component: RoomChangeDashboard
});

const TINT = "#8B5CF6"; // Purple for Room Change
const tabs = ["Pending", "Approved", "Rejected", "All"];

export function RoomChangeDashboard() {
  const [tab, setTab] = useState("Pending");
  const [q, setQ] = useState("");
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchStats = async () => {
    try {
      const { data } = await wardenRoomChangeApi.getStatistics();
      setStats(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await wardenRoomChangeApi.getRequests();
      setRequests(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, []);

  const filtered = useMemo(() => {
    const base = tab === "All" ? requests : requests.filter((r) => r.status === tab);
    if (!q) return base;
    const t = q.toLowerCase();
    return base.filter((r) => 
      r.student.fullName.toLowerCase().includes(t) || 
      r.student.collegeId.toLowerCase().includes(t) || 
      r.currentRoom.number.toLowerCase().includes(t)
    );
  }, [tab, q, requests]);

  const counts = {
    Pending: requests.filter((r) => r.status === "Pending").length,
    Approved: requests.filter((r) => r.status === "Approved").length,
    Rejected: requests.filter((r) => r.status === "Rejected").length,
    All: requests.length
  };

  const handleActionClick = (req, action) => {
    setSelectedRequest(req);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalSubmit = async (id, action, payload) => {
    try {
      if (action === "approve") {
        await wardenRoomChangeApi.approveRequest(id, payload);
        toast.success("Request approved successfully.");
      } else {
        await wardenRoomChangeApi.rejectRequest(id, payload);
        toast.success("Request rejected successfully.");
      }
      setModalOpen(false);
      fetchStats();
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Room Change Requests"
        description="Review, approve, reject, and manage student room change applications."
        icon={ArrowRightLeft}
        tint={TINT}
        breadcrumbs={[{ label: "Room Change" }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="text-2xl font-bold">{stats.totalRequests || 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-amber-500">{stats.pendingRequests || 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-green-500">{stats.approvedRequests || 0}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{stats.rejectedRequests || 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm w-max">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              tab === t ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            style={tab === t ? { backgroundColor: TINT } : undefined}
          >
            {t}
            <span className="rounded-full bg-black/10 px-1.5 text-[10px]">{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">All Requests</h3>
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll, room..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-9 w-full rounded-lg pl-9 text-sm"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No requests found.
            </div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/50 transition-colors gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{r.student.fullName}</p>
                    <StatusPill status={r.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Roll: {r.student.collegeId} • Current Room: {r.currentRoom.number}
                  </p>
                  <p className="text-sm text-foreground mt-2 border-l-2 border-primary/20 pl-2">
                    <span className="font-medium text-muted-foreground">Reason: </span>
                    {r.reason}
                  </p>
                  {r.status === "Approved" && (
                    <p className="text-sm text-green-600 mt-1">
                      Assigned Room: {r.requestedRoom?.number} | Remarks: {r.remarks || 'None'}
                    </p>
                  )}
                  {r.status === "Rejected" && (
                    <p className="text-sm text-red-600 mt-1">
                      Reason: {r.rejectionReason}
                    </p>
                  )}
                </div>
                
                {r.status === "Pending" && (
                  <div className="flex gap-2 self-start sm:self-center">
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleActionClick(r, "reject")}
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleActionClick(r, "approve")}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <RoomChangeActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        request={selectedRequest}
        action={modalAction}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default RoomChangeDashboard;

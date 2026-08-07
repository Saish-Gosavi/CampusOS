import { useEffect, useState } from "react";
import { createFileRoute } from "@/routes/compat";
import { ArrowRightLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { studentRoomChangeApi } from "@/services/api";
import { StatusPill } from "@/components/hostel/StatusPill";

export const Route = createFileRoute("/student/room-change")({
  component: RoomChangePage
});

export function RoomChangePage() {
  const [requests, setRequests] = useState([]);
  const [reason, setReason] = useState("");
  const [requestedRoomId, setRequestedRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const { data } = await studentRoomChangeApi.getMyRequests();
      setRequests(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const hasPending = requests.some(r => r.status === "Pending");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentRoomChangeApi.submitRequest({ reason, requestedRoomId });
      toast.success("Room change request submitted successfully.");
      setReason("");
      setRequestedRoomId("");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
        title="Room Change Request"
        description="Apply for a room change and check your application status."
        icon={ArrowRightLeft}
        tint="#8B5CF6"
        breadcrumbs={[{ label: "Hostel", to: "/student/room" }, { label: "Room Change" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 self-start">
          <h2 className="text-lg font-semibold mb-4 text-foreground">New Request</h2>
          {hasPending ? (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm flex gap-2">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>You already have a pending room change request. Please wait for the warden to process it before submitting a new one.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Requested Room ID (Optional)</label>
                <Input 
                  value={requestedRoomId}
                  onChange={(e) => setRequestedRoomId(e.target.value)}
                  placeholder="e.g. 104"
                />
                <p className="text-xs text-muted-foreground">If you have a specific room in mind, enter its ID.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Change <span className="text-red-500">*</span></label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you want to change your room..."
                  required
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={loading || !reason} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]">
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col h-[500px]">
          <div className="p-4 border-b border-border shrink-0">
            <h2 className="text-lg font-semibold text-foreground">Request History</h2>
          </div>
          <div className="p-0 overflow-y-auto flex-1">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                <ArrowRightLeft className="w-12 h-12 text-muted-foreground/30 mb-4" />
                You haven't made any room change requests yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {requests.map(req => (
                  <div key={req.id} className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <StatusPill status={req.status} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">Current Room:</span> {req.currentRoom?.number}
                    </div>
                    {req.requestedRoom && (
                      <div className="text-sm">
                        <span className="font-medium">Requested Room:</span> {req.requestedRoom?.number}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground mt-2 border-l-2 border-primary/20 pl-2">
                      {req.reason}
                    </div>

                    {req.status === "Approved" && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm text-green-800 border border-green-200">
                        <div className="flex items-center gap-2 font-medium mb-1">
                          <CheckCircle2 className="w-4 h-4" /> Approved
                        </div>
                        <p><strong>Remarks:</strong> {req.remarks || "None"}</p>
                      </div>
                    )}
                    {req.status === "Rejected" && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-800 border border-red-200">
                        <div className="flex items-center gap-2 font-medium mb-1">
                          <XCircle className="w-4 h-4" /> Rejected
                        </div>
                        <p><strong>Reason:</strong> {req.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomChangePage;

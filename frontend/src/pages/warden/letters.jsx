import { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { FileText, Loader2, Send } from "lucide-react";
import { letterApi } from "@/services/api";
import { toast } from "sonner";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { Button } from "@/components/ui/button";

const Route = createFileRoute("/warden/letters")({
  component: WardenLettersPage
});

function WardenLettersPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await letterApi.getHostelRequests();
      setRequests(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch letter requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setApprovingId(id);
      await letterApi.approveLetter(id);
      toast.success("Letter approved and sent to student!");
      await fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve letter");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-6">
      <WardenPageHeader
        title="Occupancy Letters"
        description="Manage and issue room occupancy letters to students."
        icon={FileText}
        tint="#210963"
        breadcrumbs={[{ label: "Occupancy Letters" }]}
      />

      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            No pending letter requests found in your hostel.
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {req.student?.fullName} <span className="text-muted-foreground text-sm font-normal">({req.student?.collegeId})</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Requested on: {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {req.status === "pending" ? (
                  <Button 
                    onClick={() => handleApprove(req.id)} 
                    disabled={approvingId === req.id}
                    className="bg-[#210963] text-white hover:opacity-90"
                  >
                    {approvingId === req.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send Letter
                  </Button>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600">
                    Sent (Ref: {req.referenceNo})
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export { Route };

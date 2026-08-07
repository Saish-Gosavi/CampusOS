import { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { FileText, Plus, Download, Loader2, CheckCircle2, Clock } from "lucide-react";
import { letterApi } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";

const Route = createFileRoute("/student/letters")({
  component: StudentLettersPage
});

function StudentLettersPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await letterApi.getStudentRequests();
      setRequests(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch letter requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLetter = async () => {
    try {
      setRequesting(true);
      await letterApi.requestLetter();
      toast.success("Letter requested successfully!");
      await fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request letter");
    } finally {
      setRequesting(false);
    }
  };

  const handleDownload = (request) => {
    try {
      const doc = new jsPDF();
      
      // Basic formatting for now
      doc.setFontSize(22);
      doc.text("Room Occupancy Letter", 105, 30, { align: "center" });
      
      doc.setFontSize(12);
      doc.text(`Reference No: ${request.referenceNo}`, 20, 50);
      doc.text(`Date Issued: ${new Date(request.issuedDate).toLocaleDateString()}`, 140, 50);
      
      doc.text(`To Whom It May Concern,`, 20, 70);
      
      const bodyText = `This is to certify that the student with ID ${request.student?.collegeId} has been allotted a room in the hostel facilities. This letter serves as an official proof of occupancy.`;
      const splitText = doc.splitTextToSize(bodyText, 170);
      
      doc.text(splitText, 20, 90);
      
      doc.text(`Issued by Warden: ${request.warden?.fullName || "Admin"}`, 20, 140);
      
      doc.save(`Occupancy_Letter_${request.referenceNo}.pdf`);
      toast.success("Letter downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Occupancy Letters</h1>
          <p className="text-sm text-muted-foreground">Request and download official room occupancy letters.</p>
        </div>
        <Button onClick={handleRequestLetter} disabled={requesting} className="bg-[#210963] text-white hover:opacity-90">
          {requesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Request New Letter
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            No letter requests found.
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Room Occupancy Letter</h3>
                  <p className="text-sm text-muted-foreground">
                    Requested on: {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {req.status === "pending" ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-600">
                    <Clock className="h-4 w-4" /> Pending Approval
                  </span>
                ) : req.status === "approved" ? (
                  <>
                    <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> Approved
                    </span>
                    <Button variant="outline" onClick={() => handleDownload(req)} className="ml-2">
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                  </>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-600">
                    Rejected
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

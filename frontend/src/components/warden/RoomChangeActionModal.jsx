import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function RoomChangeActionModal({ open, onClose, request, action, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [newRoomId, setNewRoomId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  if (!request) return null;

  const handleSubmit = async () => {
    setLoading(true);
    if (action === "approve") {
      await onSubmit(request.id, "approve", { newRoomId, remarks });
    } else {
      await onSubmit(request.id, "reject", { rejectionReason });
    }
    setLoading(false);
  };

  // Reset state when opening/closing
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setNewRoomId("");
      setRemarks("");
      setRejectionReason("");
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action === "approve" ? "Approve" : "Reject"} Room Change Request</DialogTitle>
          <DialogDescription>
            Student: {request.student?.fullName} ({request.student?.collegeId})<br/>
            Current Room: {request.currentRoom?.number}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {action === "approve" ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Assign New Room ID</label>
                <Input 
                  value={newRoomId} 
                  onChange={e => setNewRoomId(e.target.value)} 
                  placeholder="Enter Room ID" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Remarks (Optional)</label>
                <Textarea 
                  value={remarks} 
                  onChange={e => setRemarks(e.target.value)} 
                  placeholder="Add any remarks" 
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason <span className="text-red-500">*</span></label>
              <Textarea 
                value={rejectionReason} 
                onChange={e => setRejectionReason(e.target.value)} 
                placeholder="State the reason for rejection" 
                required
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || (action === "approve" ? !newRoomId : !rejectionReason)}
            variant={action === "approve" ? "default" : "destructive"}
          >
            {loading ? "Processing..." : action === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

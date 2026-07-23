import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserRoundCheck, Search, UserPlus, Eye, LogIn, LogOut, History as HistoryIcon, FileText } from "lucide-react";
import { SecurityPageHeader } from "@/components/security/SecurityPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { visitorRequests } from "@/lib/hostel-data";
const Route = createFileRoute("/security/visitors")({
  component: VisitorsPage
});
const TINT = "#06B6D4";
function VisitorsPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(null);
  const filter = (l) => l.filter((v) => !q || v.visitorName.toLowerCase().includes(q.toLowerCase()) || v.student.toLowerCase().includes(q.toLowerCase()));
  const approved = filter(visitorRequests.filter((v) => v.status === "Approved"));
  const inside = filter(visitorRequests.filter((v) => v.status === "Checked-In"));
  const history = filter(visitorRequests.filter((v) => v.status === "Checked-Out" || v.status === "Expired"));
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <SecurityPageHeader
    title="Visitor Management"
    description="Register visitors, verify approvals and log check-in / check-out at the gate."
    icon={UserRoundCheck}
    tint={TINT}
    breadcrumbs={[{ label: "Visitors" }]}
    action={<RegisterVisitorDialog />}
  />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search visitor or student…" className="h-10 pl-9" />
        </div>
      </div>

      <Tabs defaultValue="entry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entry" className="gap-1.5"><LogIn className="h-3.5 w-3.5" /> Ready to Enter ({approved.length})</TabsTrigger>
          <TabsTrigger value="exit" className="gap-1.5"><LogOut className="h-3.5 w-3.5" /> Currently Inside ({inside.length})</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><HistoryIcon className="h-3.5 w-3.5" /> History</TabsTrigger>
        </TabsList>
        <TabsContent value="entry"><VisitorTable rows={approved} action="check-in" onView={setActive} /></TabsContent>
        <TabsContent value="exit"><VisitorTable rows={inside} action="check-out" onView={setActive} /></TabsContent>
        <TabsContent value="history"><VisitorTable rows={history} onView={setActive} /></TabsContent>
      </Tabs>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg">
          {active && <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#06B6D4]" /> Visitor Details
                </DialogTitle>
                <DialogDescription>Verify identity before allowing entry</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <Row label="Visitor" value={active.visitorName} />
                <Row label="Mobile" value={active.visitorPhone} />
                <Row label="ID Proof" value={active.visitorIdProof} />
                <Row label="Meeting" value={`${active.relation} \xB7 ${active.student}`} />
                <Row label="Room" value={`${active.hostel} \xB7 ${active.room}`} />
                <Row label="Purpose" value={active.purpose} />
                <Row label="Slot" value={`${active.visitDate} \xB7 ${active.entryTime} \u2192 ${active.exitTime}`} />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusPill status={active.status} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setActive(null)}>Close</Button>
                <Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90">Confirm</Button>
              </DialogFooter>
            </>}
        </DialogContent>
      </Dialog>
    </div>;
}
function Row({ label, value }) {
  return <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>;
}
function VisitorTable({ rows, action, onView }) {
  return <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Visitor</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Room</th>
              <th className="px-4 py-3 text-left">Purpose</th>
              <th className="px-4 py-3 text-left">Slot</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((v) => <tr key={v.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] text-xs font-semibold text-white">
                      {v.visitorName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{v.visitorName}</p>
                      <p className="text-xs text-muted-foreground">{v.relation} · {v.visitorIdProof}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{v.visitorPhone}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.student}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.room}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.purpose}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.entryTime}–{v.exitTime}</td>
                <td className="px-4 py-3"><StatusPill status={v.status} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {action === "check-in" && <Button size="sm" className="h-7 gap-1 bg-[#22C55E] text-white hover:bg-[#16A34A]">
                        <LogIn className="h-3.5 w-3.5" /> Check In
                      </Button>}
                    {action === "check-out" && <Button size="sm" className="h-7 gap-1 bg-[#F97316] text-white hover:bg-[#EA580C]">
                        <LogOut className="h-3.5 w-3.5" /> Check Out
                      </Button>}
                    <button onClick={() => onView(v)} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>)}
            {rows.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">No visitors here.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>;
}
function RegisterVisitorDialog() {
  return <Dialog>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: TINT }} className="gap-2 text-white hover:opacity-90">
          <UserPlus className="h-4 w-4" /> Register Visitor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Visitor</DialogTitle>
          <DialogDescription>Log an on-the-spot visitor at the gate.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Field label="Visitor Name" placeholder="Full name" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mobile Number" placeholder="+91 …" />
            <Field label="ID Proof" placeholder="AADHAR / PAN / DL" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Student Name" placeholder="Meeting whom" />
            <Field label="Relation" placeholder="Father / Sibling…" />
          </div>
          <Field label="Purpose" placeholder="Reason for visit" />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90">Register</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
function Field({ label, placeholder }) {
  return <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <Input placeholder={placeholder} className="h-9" />
    </label>;
}
export {
  Route
};

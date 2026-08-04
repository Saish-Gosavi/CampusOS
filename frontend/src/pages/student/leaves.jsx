import { createFileRoute } from "@/routes/compat";
import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusPill } from "@/components/hostel/StatusPill";
import { myLeaves } from "@/lib/student-data";
const Route = createFileRoute("/student/leaves")({
  head: () => ({ meta: [{ title: "Leave Applications \u2014 Student Portal" }] }),
  component: LeavesPage
});
function LeavesPage() {
  const [open, setOpen] = useState(false);
  const pending = myLeaves.filter((l) => l.status === "Pending");
  const approved = myLeaves.filter((l) => l.status === "Approved");
  const rejected = myLeaves.filter((l) => l.status === "Rejected");
  const table = (rows) => <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">From</th>
              <th className="px-4 py-3 text-left">To</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Remarks</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No records</td></tr> : rows.map((r) => <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{r.type}</td>
                <td className="px-4 py-3">{new Date(r.from).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(r.to).toLocaleDateString()}</td>
                <td className="px-4 py-3 max-w-xs truncate">{r.reason}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.remarks ?? "\u2014"}</td>
                <td className="px-4 py-3"><StatusPill status={r.status} /></td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="Leave Application"
    description="Apply for leave and track requests"
    icon={CalendarDays}
    tint="#F97316"
    breadcrumbs={[{ label: "Hostel", to: "/student/room" }, { label: "Leaves" }]}
    action={<Button onClick={() => setOpen((v) => !v)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> {open ? "Close form" : "Apply Leave"}
          </Button>}
  />

      {open && <form
    onSubmit={(e) => {
      e.preventDefault();
      setOpen(false);
    }}
    className="rounded-xl border border-border bg-card p-5 shadow-sm"
  >
          <h3 className="mb-4 text-sm font-semibold text-foreground">New leave request</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Leave type</Label>
              <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Home Visit</option><option>Medical</option><option>Personal</option><option>Event</option>
              </select>
            </div>
            <div />
            <div><Label>From date</Label><Input type="date" /></div>
            <div><Label>To date</Label><Input type="date" /></div>
            <div className="sm:col-span-2">
              <Label>Reason</Label>
              <Textarea placeholder="Explain the reason for your leave..." rows={3} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">Submit request</Button>
          </div>
        </form>}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
          <TabsTrigger value="all">History ({myLeaves.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">{table(pending)}</TabsContent>
        <TabsContent value="approved" className="mt-4">{table(approved)}</TabsContent>
        <TabsContent value="rejected" className="mt-4">{table(rejected)}</TabsContent>
        <TabsContent value="all" className="mt-4">{table(myLeaves)}</TabsContent>
      </Tabs>
    </div>;
}
export {
  Route
};

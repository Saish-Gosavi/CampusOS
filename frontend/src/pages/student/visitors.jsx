import { createFileRoute } from "@/routes/compat";
import { useState } from "react";
import { UserRoundCheck, Plus } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill } from "@/components/hostel/StatusPill";
import { myVisitors } from "@/lib/student-data";
const Route = createFileRoute("/student/visitors")({
  head: () => ({ meta: [{ title: "Visitor Requests \u2014 Student Portal" }] }),
  component: VisitorsPage
});
function VisitorsPage() {
  const [open, setOpen] = useState(false);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="Visitor Requests"
    description="Invite family or guardians and track visits"
    icon={UserRoundCheck}
    tint="#06B6D4"
    breadcrumbs={[{ label: "Hostel", to: "/student/room" }, { label: "Visitors" }]}
    action={<Button onClick={() => setOpen((v) => !v)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> {open ? "Close form" : "New visitor request"}
          </Button>}
  />

      {open && <form
    onSubmit={(e) => {
      e.preventDefault();
      setOpen(false);
    }}
    className="rounded-xl border border-border bg-card p-5 shadow-sm"
  >
          <h3 className="mb-4 text-sm font-semibold text-foreground">Request visitor pass</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><Label>Visitor name</Label><Input placeholder="Full name" /></div>
            <div>
              <Label>Relation</Label>
              <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Father</option><option>Mother</option><option>Sibling</option>
                <option>Guardian</option><option>Relative</option><option>Friend</option>
              </select>
            </div>
            <div><Label>Mobile</Label><Input placeholder="+91 ..." /></div>
            <div><Label>Visit date</Label><Input type="date" /></div>
            <div className="sm:col-span-2"><Label>Purpose</Label><Textarea rows={3} placeholder="Reason for the visit..." /></div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">Send request</Button>
          </div>
        </form>}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Visitor</th>
                <th className="px-4 py-3 text-left">Relation</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-left">Visit Date</th>
                <th className="px-4 py-3 text-left">Purpose</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myVisitors.map((v) => <tr key={v.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{v.name}</td>
                  <td className="px-4 py-3">{v.relation}</td>
                  <td className="px-4 py-3">{v.mobile}</td>
                  <td className="px-4 py-3">{new Date(v.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{v.purpose}</td>
                  <td className="px-4 py-3"><StatusPill status={v.status} /></td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
export {
  Route
};

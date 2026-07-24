import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserRoundCheck, CheckCircle2, XCircle, Eye, Search } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { StatCard } from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { visitorRequests } from "@/lib/hostel-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const Route = createFileRoute("/warden/visitors")({
  component: VisitorsPage
});
const TINT = "#06B6D4";
const tabs = ["Today", "Requests", "History"];
const TODAY = "2026-07-22";
function VisitorsPage() {
  const [tab, setTab] = useState("Today");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => {
    let base = visitorRequests;
    if (tab === "Today") base = base.filter((v) => v.visitDate === TODAY);
    else if (tab === "Requests") base = base.filter((v) => v.status === "Pending");
    if (!q) return base;
    const t = q.toLowerCase();
    return base.filter((v) => v.visitorName.toLowerCase().includes(t) || v.student.toLowerCase().includes(t) || v.room.toLowerCase().includes(t));
  }, [tab, q]);
  const today = visitorRequests.filter((v) => v.visitDate === TODAY).length;
  const pending = visitorRequests.filter((v) => v.status === "Pending").length;
  const inside = visitorRequests.filter((v) => v.status === "Checked-In").length;
  const total = visitorRequests.length;
  const decide = (action) => {
    if (!selected) return;
    toast.success(`Visitor ${selected.visitorName} ${action}`);
    setSelected(null);
  };
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Visitor Management"
    description="Approve, reject and monitor visitor requests for your hostels."
    icon={UserRoundCheck}
    tint={TINT}
    breadcrumbs={[{ label: "Visitors" }]}
  />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Today's Visitors" value={String(today)} delta="Scheduled today" trend="up" icon={UserRoundCheck} tint="#06B6D4" />
        <StatCard label="Pending Requests" value={String(pending)} delta="Awaiting decision" trend="down" icon={UserRoundCheck} tint="#F97316" />
        <StatCard label="Currently Inside" value={String(inside)} delta="Checked-in" trend="up" icon={CheckCircle2} tint="#22C55E" />
        <StatCard label="Total Records" value={String(total)} delta="All visitors" trend="up" icon={UserRoundCheck} tint="#7B4CED" />
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {tabs.map((t) => <button
    key={t}
    onClick={() => setTab(t)}
    className={cn(
      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      tab === t ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
    style={tab === t ? { backgroundColor: TINT } : void 0}
  >
            {t}
          </button>)}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="relative mb-3 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search visitor, student, room..." className="h-10 pl-9" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-3 pr-2">Visitor</th>
                <th className="py-3 pr-2">Student</th>
                <th className="py-3 pr-2">Relation</th>
                <th className="py-3 pr-2">Purpose</th>
                <th className="py-3 pr-2">Visit Date</th>
                <th className="py-3 pr-2">Entry</th>
                <th className="py-3 pr-2">Exit</th>
                <th className="py-3 pr-2">Status</th>
                <th className="py-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => <tr key={v.id} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                  <td className="py-3 pr-2">
                    <p className="font-medium text-foreground">{v.visitorName}</p>
                    <p className="text-xs text-muted-foreground">{v.visitorPhone}</p>
                  </td>
                  <td className="py-3 pr-2">
                    <p className="font-medium">{v.student}</p>
                    <p className="text-xs text-muted-foreground">{v.room}</p>
                  </td>
                  <td className="py-3 pr-2">{v.relation}</td>
                  <td className="py-3 pr-2 max-w-xs truncate text-xs text-muted-foreground" title={v.purpose}>{v.purpose}</td>
                  <td className="py-3 pr-2 text-xs">{v.visitDate}</td>
                  <td className="py-3 pr-2 text-xs">{v.entryTime}</td>
                  <td className="py-3 pr-2 text-xs">{v.exitTime}</td>
                  <td className="py-3 pr-2"><StatusPill status={v.status} /></td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelected(v)} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-3.5 w-3.5" /></button>
                      {v.status === "Pending" && <>
                          <button onClick={() => {
    setSelected(v);
  }} className="grid h-7 w-7 place-items-center rounded-md bg-[#22C55E]/10 text-[#16A34A] hover:bg-[#22C55E]/20"><CheckCircle2 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => {
    setSelected(v);
  }} className="grid h-7 w-7 place-items-center rounded-md bg-[#EF4444]/10 text-[#DC2626] hover:bg-[#EF4444]/20"><XCircle className="h-3.5 w-3.5" /></button>
                        </>}
                    </div>
                  </td>
                </tr>)}
              {filtered.length === 0 && <tr><td colSpan={9} className="py-10 text-center text-muted-foreground">No visitor records</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">{selected.visitorName}</h3>
            <p className="text-xs text-muted-foreground">Visiting {selected.student} · {selected.room}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-muted-foreground">Phone</p><p>{selected.visitorPhone}</p></div>
              <div><p className="text-xs text-muted-foreground">ID Proof</p><p>{selected.visitorIdProof}</p></div>
              <div><p className="text-xs text-muted-foreground">Relation</p><p>{selected.relation}</p></div>
              <div><p className="text-xs text-muted-foreground">Visit Date</p><p>{selected.visitDate}</p></div>
              <div><p className="text-xs text-muted-foreground">Entry</p><p>{selected.entryTime}</p></div>
              <div><p className="text-xs text-muted-foreground">Exit</p><p>{selected.exitTime}</p></div>
              <div className="col-span-2"><p className="text-xs text-muted-foreground">Purpose</p><p>{selected.purpose}</p></div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              {selected.status === "Pending" && <>
                  <Button variant="outline" className="border-[#EF4444]/40 text-[#DC2626] hover:bg-[#EF4444]/10" onClick={() => decide("rejected")}><XCircle className="mr-1.5 h-4 w-4" />Reject</Button>
                  <Button className="bg-[#22C55E] text-white hover:bg-[#16A34A]" onClick={() => decide("approved")}><CheckCircle2 className="mr-1.5 h-4 w-4" />Approve</Button>
                </>}
            </div>
          </div>
        </div>}
    </div>;
}
export {
  Route
};

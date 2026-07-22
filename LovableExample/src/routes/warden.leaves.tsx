import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, XCircle, Eye, Search } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { leaveRequests, type LeaveRequest } from "@/lib/hostel-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/warden/leaves")({
  component: LeavesPage,
});

const TINT = "#F97316";

const tabs = ["Pending", "Approved", "Rejected", "History"] as const;
type Tab = (typeof tabs)[number];

function LeavesPage() {
  const [tab, setTab] = useState<Tab>("Pending");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<LeaveRequest | null>(null);
  const [remarks, setRemarks] = useState("");

  const filtered = useMemo(() => {
    const base =
      tab === "History"
        ? leaveRequests
        : leaveRequests.filter((l) => l.status === tab);
    if (!q) return base;
    const t = q.toLowerCase();
    return base.filter((l) => l.student.toLowerCase().includes(t) || l.enrollment.toLowerCase().includes(t) || l.room.toLowerCase().includes(t));
  }, [tab, q]);

  const counts = {
    Pending: leaveRequests.filter((l) => l.status === "Pending").length,
    Approved: leaveRequests.filter((l) => l.status === "Approved").length,
    Rejected: leaveRequests.filter((l) => l.status === "Rejected").length,
    History: leaveRequests.length,
  };

  const decide = (action: "Approved" | "Rejected") => {
    if (!selected) return;
    toast.success(`Leave ${action.toLowerCase()} for ${selected.student}`);
    setSelected(null);
    setRemarks("");
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Leave Requests"
        description="Approve, reject and review leave applications from your residents."
        icon={CalendarDays}
        tint={TINT}
        breadcrumbs={[{ label: "Leave Requests" }]}
      />

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              tab === t ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            style={tab === t ? { backgroundColor: TINT } : undefined}
          >
            {t}
            <span className="rounded-full bg-black/10 px-1.5 text-[10px]">{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="relative mb-3 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search student, enrollment, room..." className="h-10 pl-9" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-3 pr-2">Student</th>
                <th className="py-3 pr-2">Room</th>
                <th className="py-3 pr-2">Leave Type</th>
                <th className="py-3 pr-2">From</th>
                <th className="py-3 pr-2">To</th>
                <th className="py-3 pr-2">Days</th>
                <th className="py-3 pr-2">Reason</th>
                <th className="py-3 pr-2">Status</th>
                <th className="py-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                  <td className="py-3 pr-2">
                    <p className="font-medium text-foreground">{l.student}</p>
                    <p className="text-xs text-muted-foreground">{l.enrollment}</p>
                  </td>
                  <td className="py-3 pr-2 font-medium">{l.room}</td>
                  <td className="py-3 pr-2">{l.leaveType}</td>
                  <td className="py-3 pr-2 text-xs">{l.from}</td>
                  <td className="py-3 pr-2 text-xs">{l.to}</td>
                  <td className="py-3 pr-2">{l.days}</td>
                  <td className="py-3 pr-2 max-w-xs truncate text-xs text-muted-foreground" title={l.reason}>{l.reason}</td>
                  <td className="py-3 pr-2"><StatusPill status={l.status} /></td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelected(l); setRemarks(l.remarks); }} title="View details" className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-3.5 w-3.5" /></button>
                      {l.status === "Pending" && (
                        <>
                          <button onClick={() => { setSelected(l); setRemarks(""); }} title="Approve" className="grid h-7 w-7 place-items-center rounded-md bg-[#22C55E]/10 text-[#16A34A] hover:bg-[#22C55E]/20"><CheckCircle2 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => { setSelected(l); setRemarks(""); }} title="Reject" className="grid h-7 w-7 place-items-center rounded-md bg-[#EF4444]/10 text-[#DC2626] hover:bg-[#EF4444]/20"><XCircle className="h-3.5 w-3.5" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-10 text-center text-muted-foreground">No leave requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-foreground">{selected.student}</h3>
            <p className="text-xs text-muted-foreground">{selected.enrollment} · {selected.room} · {selected.hostel}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-muted-foreground">Leave Type</p><p className="font-medium">{selected.leaveType}</p></div>
              <div><p className="text-xs text-muted-foreground">Days</p><p className="font-medium">{selected.days}</p></div>
              <div><p className="text-xs text-muted-foreground">From</p><p className="font-medium">{selected.from}</p></div>
              <div><p className="text-xs text-muted-foreground">To</p><p className="font-medium">{selected.to}</p></div>
              <div className="col-span-2"><p className="text-xs text-muted-foreground">Destination</p><p className="font-medium">{selected.destination}</p></div>
              <div className="col-span-2"><p className="text-xs text-muted-foreground">Reason</p><p>{selected.reason}</p></div>
              <div><p className="text-xs text-muted-foreground">Parent Contact</p><p>{selected.parentContact}</p></div>
              <div><p className="text-xs text-muted-foreground">Applied On</p><p>{selected.appliedOn}</p></div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Warden Remarks</label>
              <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-background p-3 text-sm" placeholder="Add remarks before deciding..." />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              {selected.status === "Pending" && (
                <>
                  <Button variant="outline" className="border-[#EF4444]/40 text-[#DC2626] hover:bg-[#EF4444]/10" onClick={() => decide("Rejected")}>
                    <XCircle className="mr-1.5 h-4 w-4" /> Reject
                  </Button>
                  <Button className="bg-[#22C55E] text-white hover:bg-[#16A34A]" onClick={() => decide("Approved")}>
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

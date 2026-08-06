import { useMemo, useState } from "react";
import { createFileRoute } from "@/routes/compat";
import { DoorOpen, Search, Filter, Eye, Download, LogIn, LogOut, History as HistoryIcon } from "lucide-react";
import { SecurityPageHeader } from "@/components/security/SecurityPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inOutEntries } from "@/lib/hostel-data";
const Route = createFileRoute("/security/in-out")({
  component: InOutPage
});
const TINT = "#2563EB";
function InOutPage() {
  const [q, setQ] = useState("");
  const filter = (list) => list.filter(
    (e) => !q || e.student.toLowerCase().includes(q.toLowerCase()) || e.enrollment.toLowerCase().includes(q.toLowerCase()) || e.room.toLowerCase().includes(q.toLowerCase())
  );
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const entries = useMemo(() => filter(inOutEntries.filter((e) => (e.status === "Returned" || e.status === "Late Return") && e.inDate)), [q]);
  const exits = useMemo(() => filter(inOutEntries.filter((e) => e.status === "Outside" || e.status === "Overdue")), [q]);
  const history = useMemo(() => filter(inOutEntries), [q]);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <SecurityPageHeader
    title="Student In / Out Register"
    description="Track student entries, exits and movement history at the hostel gate."
    icon={DoorOpen}
    tint={TINT}
    breadcrumbs={[{ label: "In / Out Register" }]}
    action={<div className="flex gap-2">
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            <Button style={{ backgroundColor: TINT }} className="gap-2 text-white hover:opacity-90">
              <LogIn className="h-4 w-4" /> New Entry
            </Button>
          </div>}
  />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, enrollment or room…" className="h-10 pl-9" />
        </div>
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
      </div>

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries" className="gap-1.5"><LogIn className="h-3.5 w-3.5" /> Today's Entries ({entries.length})</TabsTrigger>
          <TabsTrigger value="exits" className="gap-1.5"><LogOut className="h-3.5 w-3.5" /> Today's Exits ({exits.length})</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><HistoryIcon className="h-3.5 w-3.5" /> Movement History</TabsTrigger>
        </TabsList>
        <TabsContent value="entries"><MovementTable rows={entries} mode="in" /></TabsContent>
        <TabsContent value="exits"><MovementTable rows={exits} mode="out" /></TabsContent>
        <TabsContent value="history"><MovementTable rows={history} mode="history" /></TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">Live data · {today}</p>
    </div>;
}
function MovementTable({ rows, mode }) {
  return <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Enrollment</th>
              <th className="px-4 py-3 text-left">Room</th>
              <th className="px-4 py-3 text-left">Purpose</th>
              <th className="px-4 py-3 text-left">Exit</th>
              <th className="px-4 py-3 text-left">Entry</th>
              <th className="px-4 py-3 text-left">Gate</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => <tr key={r.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                      {r.student.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                    <span className="font-medium text-foreground">{r.student}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.enrollment}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.room}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.purpose}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.outTime}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.inTime ?? "\u2014"}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.gate}</td>
                <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                <td className="px-4 py-3 text-right">
                  <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>)}
            {rows.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">No records found · mode: {mode}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>;
}
export {
  Route
};

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Ticket, ShieldCheck, XCircle, Search, Eye } from "lucide-react";
import { SecurityPageHeader } from "@/components/security/SecurityPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gatePasses } from "@/lib/security-data";
const Route = createFileRoute("/security/gate-pass")({
  component: GatePassPage
});
const TINT = "#7B4CED";
function GatePassPage() {
  const [q, setQ] = useState("");
  const filter = (l) => l.filter((g) => !q || g.id.toLowerCase().includes(q.toLowerCase()) || g.student.toLowerCase().includes(q.toLowerCase()));
  const active = filter(gatePasses.filter((g) => g.status === "Active" || g.status === "Pending"));
  const history = filter(gatePasses.filter((g) => g.status === "Expired" || g.status === "Verified" || g.status === "Rejected"));
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <SecurityPageHeader
    title="Gate Pass Verification"
    description="Validate outing gate passes issued by wardens and log the verification."
    icon={Ticket}
    tint={TINT}
    breadcrumbs={[{ label: "Gate Pass" }]}
  />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <VerifyCard />
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Gate Passes</h3>
              <p className="text-xs text-muted-foreground">Active passes and verification history</p>
            </div>
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pass ID / student" className="h-9 pl-9" />
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
              <TabsTrigger value="history">History ({history.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4"><PassTable rows={active} showActions /></TabsContent>
            <TabsContent value="history" className="mt-4"><PassTable rows={history} /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
}
function VerifyCard() {
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const verify = () => {
    const g = gatePasses.find((p) => p.id.toLowerCase() === id.toLowerCase());
    setResult(g ?? null);
    setNotFound(!g);
  };
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#7B4CED]" />
        <h3 className="text-base font-semibold text-foreground">Verify Gate Pass</h3>
      </div>
      <p className="text-xs text-muted-foreground">Enter the pass ID or scan the pass barcode.</p>
      <div className="mt-3 flex gap-2">
        <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. GP-2402" className="h-10" />
        <Button onClick={verify} style={{ backgroundColor: TINT }} className="text-white hover:opacity-90">Verify</Button>
      </div>

      {notFound && <div className="mt-4 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-3 text-sm text-[#DC2626]">
          Pass not found. Please recheck the ID.
        </div>}

      {result && <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pass ID</p>
              <p className="text-lg font-bold text-foreground">{result.id}</p>
            </div>
            <StatusPill status={result.status} />
          </div>
          <dl className="mt-3 space-y-1.5 text-xs">
            <Row k="Student" v={`${result.student} \xB7 ${result.enrollment}`} />
            <Row k="Room" v={result.room} />
            <Row k="Purpose" v={result.purpose} />
            <Row k="Issued By" v={result.issuedBy} />
            <Row k="Valid From" v={result.validFrom} />
            <Row k="Valid Until" v={result.validUntil} />
          </dl>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button className="gap-1 bg-[#22C55E] text-white hover:bg-[#16A34A]">
              <ShieldCheck className="h-4 w-4" /> Approve
            </Button>
            <Button className="gap-1 bg-[#EF4444] text-white hover:bg-[#DC2626]">
              <XCircle className="h-4 w-4" /> Reject
            </Button>
          </div>
        </div>}
    </div>;
}
function Row({ k, v }) {
  return <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium text-foreground">{v}</span>
    </div>;
}
function PassTable({ rows, showActions }) {
  return <div className="overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Pass ID</th>
              <th className="px-3 py-2 text-left">Student</th>
              <th className="px-3 py-2 text-left">Purpose</th>
              <th className="px-3 py-2 text-left">Valid</th>
              <th className="px-3 py-2 text-left">Issued By</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((g) => <tr key={g.id} className="hover:bg-muted/30">
                <td className="px-3 py-2 font-mono text-xs font-medium text-foreground">{g.id}</td>
                <td className="px-3 py-2">
                  <p className="font-medium text-foreground">{g.student}</p>
                  <p className="text-xs text-muted-foreground">{g.room}</p>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{g.purpose}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{g.validFrom}<br />→ {g.validUntil}</td>
                <td className="px-3 py-2 text-muted-foreground">{g.issuedBy}</td>
                <td className="px-3 py-2"><StatusPill status={g.status} /></td>
                <td className="px-3 py-2 text-right">
                  {showActions ? <div className="flex justify-end gap-1">
                      <button className="grid h-7 w-7 place-items-center rounded-md bg-[#22C55E]/10 text-[#16A34A] hover:bg-[#22C55E]/20">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </button>
                      <button className="grid h-7 w-7 place-items-center rounded-md bg-[#EF4444]/10 text-[#DC2626] hover:bg-[#EF4444]/20">
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    </div> : <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Eye className="h-3.5 w-3.5" />
                    </button>}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}
export {
  Route
};

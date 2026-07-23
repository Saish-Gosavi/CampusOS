import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Receipt, Printer, Download, Search, X } from "lucide-react";
import { fees } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/fees/receipts")({
  component: ReceiptsPage
});
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
function ReceiptsPage() {
  const receipts = useMemo(() => fees.filter((f) => f.status === "Paid" && f.receipt), []);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const filtered = useMemo(() => {
    if (!query.trim()) return receipts;
    const q = query.toLowerCase();
    return receipts.filter(
      (f) => f.student.toLowerCase().includes(q) || f.enrollment.toLowerCase().includes(q) || (f.receipt ?? "").toLowerCase().includes(q)
    );
  }, [query, receipts]);
  const active = receipts.find((r) => r.id === openId) ?? null;
  return <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
    className="flex h-10 w-10 items-center justify-center rounded-lg"
    style={{ backgroundColor: "#2563EB1a", color: "#2563EB" }}
  >
              <Receipt className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Receipts</h2>
              <p className="text-xs text-muted-foreground">
                {receipts.length} receipts generated this semester.
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search receipt or student"
    className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm"
  />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => <button
    key={r.id}
    onClick={() => setOpenId(r.id)}
    className="group flex flex-col rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md"
  >
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-[#2563EB]/10 px-2 py-1 text-xs font-semibold text-[#2563EB]">
                {r.receipt}
              </span>
              <span className="text-xs text-muted-foreground">{r.paidDate}</span>
            </div>
            <p className="mt-3 text-base font-semibold text-foreground">{r.student}</p>
            <p className="text-xs text-muted-foreground">
              {r.enrollment} · {r.hostel} · {r.room}
            </p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Amount</p>
                <p className="text-lg font-bold text-[#16A34A]">{INR.format(r.amount)}</p>
              </div>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                {r.method}
              </span>
            </div>
          </button>)}
        {filtered.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No receipts match your search.
          </div>}
      </div>

      {active && <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => setOpenId(null)}
  >
          <div
    className="w-full max-w-lg overflow-hidden rounded-xl bg-card shadow-2xl"
    onClick={(e) => e.stopPropagation()}
  >
            <div
    className="flex items-center justify-between px-6 py-4 text-white"
    style={{
      background: "linear-gradient(90deg, #282648 0%, #211160 100%)"
    }}
  >
              <div>
                <p className="text-[11px] uppercase tracking-wide opacity-70">VPPCOE · CampusOS</p>
                <h3 className="text-lg font-semibold">Hostel Fee Receipt</h3>
              </div>
              <button
    onClick={() => setOpenId(null)}
    className="rounded-md p-1 text-white/80 hover:bg-white/10"
  >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 px-6 pt-5 text-sm">
              <Info label="Receipt No." value={active.receipt ?? "\u2014"} />
              <Info label="Paid On" value={active.paidDate ?? "\u2014"} />
              <Info label="Student" value={active.student} />
              <Info label="Enrollment" value={active.enrollment} />
              <Info label="Hostel" value={active.hostel} />
              <Info label="Room" value={active.room} />
              <Info label="Semester" value={active.semester} />
              <Info label="Method" value={active.method ?? "\u2014"} />
            </div>

            <div className="mx-6 mt-5 rounded-lg bg-[#22C55E]/10 p-4">
              <p className="text-xs uppercase tracking-wide text-[#16A34A]">Amount Paid</p>
              <p className="text-3xl font-bold text-[#16A34A]">{INR.format(active.amount)}</p>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
                <Download className="h-4 w-4" /> Download
              </button>
              <button
    onClick={() => window.print()}
    className="inline-flex items-center gap-1.5 rounded-md bg-[#2563EB] px-3 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8]"
  >
                <Printer className="h-4 w-4" /> Print
              </button>
            </div>
          </div>
        </div>}
    </div>;
}
function Info({ label, value }) {
  return <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>;
}
export {
  Route
};

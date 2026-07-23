import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Download, Receipt, CheckCircle2 } from "lucide-react";
import { StatusPill } from "@/components/hostel/StatusPill";
import { fees } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/fees/paid")({
  component: PaidFeesPage
});
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
const METHODS = ["All Methods", "UPI", "Card", "Net Banking", "Cash", "DD"];
function PaidFeesPage() {
  const [method, setMethod] = useState("All Methods");
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    let list = fees.filter((f) => f.status === "Paid");
    if (method !== "All Methods") list = list.filter((f) => f.method === method);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) => f.student.toLowerCase().includes(q) || f.enrollment.toLowerCase().includes(q) || (f.receipt ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [method, query]);
  const collected = rows.reduce((s, f) => s + f.amount, 0);
  return <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
    className="flex h-11 w-11 items-center justify-center rounded-lg"
    style={{ backgroundColor: "#22C55E1a", color: "#22C55E" }}
  >
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Collected (filtered)
              </p>
              <p className="text-2xl font-bold text-[#16A34A]">{INR.format(collected)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search student or receipt"
    className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm"
  />
            </div>
            <select
    value={method}
    onChange={(e) => setMethod(e.target.value)}
    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
  >
              {METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Student</th>
                <th className="px-3 py-2 font-medium">Enrollment</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Paid On</th>
                <th className="px-3 py-2 font-medium">Method</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((f) => <tr key={f.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">
                    {f.student}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{f.enrollment}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-foreground">
                    {INR.format(f.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                    {f.paidDate}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      {f.method}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={f.status} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-muted">
                      <Receipt className="h-3.5 w-3.5" /> {f.receipt}
                    </button>
                  </td>
                </tr>)}
              {rows.length === 0 && <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No paid invoices match your filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
export {
  Route
};

import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { History, Search, Download } from "lucide-react";
import { StatusPill } from "@/components/hostel/StatusPill";
import { fees } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/fees/history")({
  component: PaymentHistoryPage
});
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
const STATUSES = ["All", "Paid", "Pending", "Overdue"];
function PaymentHistoryPage() {
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    let list = [...fees].sort((a, b) => {
      const da = a.paidDate ?? a.dueDate;
      const db = b.paidDate ?? b.dueDate;
      return db.localeCompare(da);
    });
    if (status !== "All") list = list.filter((f) => f.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) => f.student.toLowerCase().includes(q) || f.enrollment.toLowerCase().includes(q) || f.hostel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [status, query]);
  return <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span
    className="flex h-10 w-10 items-center justify-center rounded-lg"
    style={{ backgroundColor: "#7B4CED1a", color: "#7B4CED" }}
  >
              <History className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Payment History</h2>
              <p className="text-xs text-muted-foreground">
                Full ledger across the current semester.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search student or hostel"
    className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm"
  />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {STATUSES.map((s) => <button
    key={s}
    onClick={() => setStatus(s)}
    className={"rounded-full border px-3 py-1 text-xs font-medium transition-colors " + (status === s ? "border-transparent bg-[#7B4CED] text-white" : "border-border bg-card text-foreground hover:bg-muted")}
  >
              {s}
            </button>)}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Student</th>
                <th className="px-3 py-2 font-medium">Hostel / Room</th>
                <th className="px-3 py-2 font-medium">Semester</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Method</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((f) => <tr key={f.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                    {f.paidDate ?? f.dueDate}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p className="font-medium text-foreground">{f.student}</p>
                    <p className="text-xs text-muted-foreground">{f.enrollment}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                    {f.hostel} · {f.room}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{f.semester}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-foreground">
                    {INR.format(f.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                    {f.method ?? "\u2014"}
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={f.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">
                    {f.receipt ?? "\u2014"}
                  </td>
                </tr>)}
              {rows.length === 0 && <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No transactions match your filters.
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

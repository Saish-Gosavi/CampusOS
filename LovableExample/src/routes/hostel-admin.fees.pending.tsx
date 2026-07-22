import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Send, Wallet, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/hostel/StatusPill";
import { fees } from "@/lib/hostel-data";

export const Route = createFileRoute("/hostel-admin/fees/pending")({
  component: PendingFeesPage,
});

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const FILTERS = ["All Unpaid", "Pending", "Overdue"] as const;

function PendingFeesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All Unpaid");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    let list = fees.filter((f) => f.status !== "Paid");
    if (filter !== "All Unpaid") list = list.filter((f) => f.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) =>
          f.student.toLowerCase().includes(q) ||
          f.enrollment.toLowerCase().includes(q) ||
          f.hostel.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, query]);

  const summary = useMemo(() => {
    const pending = fees.filter((f) => f.status === "Pending");
    const overdue = fees.filter((f) => f.status === "Overdue");
    return {
      pendingAmt: pending.reduce((s, f) => s + f.amount, 0),
      overdueAmt: overdue.reduce((s, f) => s + f.amount, 0),
      pendingCount: pending.length,
      overdueCount: overdue.length,
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Tile
          icon={Clock}
          label="Pending"
          value={INR.format(summary.pendingAmt)}
          hint={`${summary.pendingCount} invoices`}
          tint="#F59E0B"
        />
        <Tile
          icon={AlertTriangle}
          label="Overdue"
          value={INR.format(summary.overdueAmt)}
          hint={`${summary.overdueCount} students past due`}
          tint="#EF4444"
        />
        <Tile
          icon={Wallet}
          label="Total Outstanding"
          value={INR.format(summary.pendingAmt + summary.overdueAmt)}
          hint="Aug-Dec 2026 semester"
          tint="#2563EB"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                  (filter === f
                    ? "border-transparent bg-[#EF4444] text-white"
                    : "border-border bg-card text-foreground hover:bg-muted")
                }
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, enrollment, hostel"
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Student</th>
                <th className="px-3 py-2 font-medium">Enrollment</th>
                <th className="px-3 py-2 font-medium">Hostel / Room</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Due Date</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((f) => (
                <tr key={f.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">
                    {f.student}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{f.enrollment}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                    {f.hostel} · {f.room}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-foreground">
                    {INR.format(f.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                    {f.dueDate}
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={f.status} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => toast.success(`Reminder sent to ${f.student}`)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        <Send className="h-3.5 w-3.5" /> Remind
                      </button>
                      <button
                        onClick={() => toast.success(`Payment recorded for ${f.student}`)}
                        className="inline-flex items-center gap-1 rounded-md bg-[#22C55E] px-2 py-1 text-xs font-medium text-white hover:bg-[#16A34A]"
                      >
                        <Wallet className="h-3.5 w-3.5" /> Collect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No pending invoices match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  value,
  hint,
  tint,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  hint: string;
  tint: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold" style={{ color: tint }}>
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${tint}1a`, color: tint }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

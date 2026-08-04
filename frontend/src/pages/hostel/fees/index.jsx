import { useMemo } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { fees, students } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/fees/")({
  component: FeesDashboard
});
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
function FeesDashboard() {
  const stats = useMemo(() => {
    const collected = fees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.amount, 0);
    const pending = fees.filter((f) => f.status === "Pending").reduce((s, f) => s + f.amount, 0);
    const overdue = fees.filter((f) => f.status === "Overdue").reduce((s, f) => s + f.amount, 0);
    const pendingStudents = new Set(
      fees.filter((f) => f.status !== "Paid").map((f) => f.enrollment)
    ).size;
    const total = collected + pending + overdue;
    const collectionRate = total ? Math.round(collected / total * 100) : 0;
    return { collected, pending, overdue, pendingStudents, total, collectionRate };
  }, []);
  const byHostel = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const f of fees) {
      const cur = map.get(f.hostel) ?? { collected: 0, pending: 0 };
      if (f.status === "Paid") cur.collected += f.amount;
      else cur.pending += f.amount;
      map.set(f.hostel, cur);
    }
    return Array.from(map, ([hostel, v]) => ({ hostel, ...v }));
  }, []);
  const recent = useMemo(
    () => fees.filter((f) => f.status === "Paid").sort((a, b) => (b.paidDate ?? "").localeCompare(a.paidDate ?? "")).slice(0, 5),
    []
  );
  return <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
    label="Collected Fees"
    value={INR.format(stats.collected)}
    hint={`${stats.collectionRate}% collection rate`}
    icon={CheckCircle2}
    tint="#22C55E"
  />
        <StatCard
    label="Pending Fees"
    value={INR.format(stats.pending)}
    hint={`${fees.filter((f) => f.status === "Pending").length} invoices`}
    icon={Clock}
    tint="#F59E0B"
  />
        <StatCard
    label="Overdue Fees"
    value={INR.format(stats.overdue)}
    hint={`${fees.filter((f) => f.status === "Overdue").length} students past due`}
    icon={AlertTriangle}
    tint="#EF4444"
  />
        <StatCard
    label="Students Pending"
    value={stats.pendingStudents.toString()}
    hint={`out of ${students.length} residents`}
    icon={Users}
    tint="#2563EB"
  />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Collection by Hostel</h3>
              <p className="text-xs text-muted-foreground">Semester Aug–Dec 2026</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E]/10 px-2 py-1 text-xs font-medium text-[#16A34A]">
              <TrendingUp className="h-3.5 w-3.5" /> {stats.collectionRate}% overall
            </span>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {byHostel.map((h) => {
    const total = h.collected + h.pending;
    const pct = total ? Math.round(h.collected / total * 100) : 0;
    return <div key={h.hostel}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{h.hostel}</span>
                    <span className="text-muted-foreground">
                      {INR.format(h.collected)} / {INR.format(total)}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
      className="h-full rounded-full bg-[#22C55E] transition-all"
      style={{ width: `${pct}%` }}
    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{pct}% collected</p>
                </div>;
  })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold text-foreground">Recent Payments</h3>
          <p className="text-xs text-muted-foreground">Latest 5 receipts</p>
          <ul className="mt-4 divide-y divide-border">
            {recent.map((r) => <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.student}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.receipt} • {r.method} • {r.paidDate}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#16A34A]">
                  {INR.format(r.amount)}
                </span>
              </li>)}
          </ul>
        </div>
      </div>
    </div>;
}
function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tint
}) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span
    className="flex h-10 w-10 items-center justify-center rounded-lg"
    style={{ backgroundColor: `${tint}1a`, color: tint }}
  >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>;
}
export {
  Route
};

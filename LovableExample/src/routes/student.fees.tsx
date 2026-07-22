import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, Download, Receipt } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/hostel/StatusPill";
import { myFees } from "@/lib/student-data";

export const Route = createFileRoute("/student/fees")({
  head: () => ({ meta: [{ title: "Hostel Fees — Student Portal" }] }),
  component: FeesPage,
});

function FeesPage() {
  const pending = myFees.filter((f) => f.status !== "Paid");
  const totalDue = pending.reduce((sum, f) => sum + f.amount, 0);
  const paid = myFees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.amount, 0);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
        title="Hostel Fees"
        description="Payment history, receipts and dues"
        icon={IndianRupee}
        tint="#22C55E"
        breadcrumbs={[{ label: "Hostel", to: "/student/room" }, { label: "Fees" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Outstanding dues</p>
          <p className="mt-2 text-3xl font-bold text-[#EF4444]">₹{totalDue.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">{pending.length} bill(s) unpaid</p>
          <Button className="mt-4 w-full bg-[#22C55E] hover:bg-[#16a34a]">Pay now</Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Total paid this year</p>
          <p className="mt-2 text-3xl font-bold text-[#22C55E]">₹{paid.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across all sessions</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Next due date</p>
          <p className="mt-2 text-3xl font-bold text-foreground">15 Aug</p>
          <p className="mt-1 text-xs text-muted-foreground">Semester 6 · Autumn 2026</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">Payment history</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Term</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Due date</th>
                <th className="px-4 py-3 text-left">Paid on</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myFees.map((f) => (
                <tr key={f.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{f.term}</td>
                  <td className="px-4 py-3">₹{f.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{f.paidOn ? new Date(f.paidOn).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3"><StatusPill status={f.status} /></td>
                  <td className="px-4 py-3">
                    {f.receipt ? (
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted">
                        <Receipt className="h-3.5 w-3.5" /> {f.receipt}
                        <Download className="ml-1 h-3.5 w-3.5" />
                      </button>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

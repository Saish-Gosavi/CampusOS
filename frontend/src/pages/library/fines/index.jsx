import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee } from "lucide-react";
import { LibraryPageHeader } from "@/components/library/LibraryPageHeader";
import { LibraryStatusPill } from "@/components/library/LibraryStatusPill";
import { Button } from "@/components/ui/button";
import { fines } from "@/lib/library-data";
const Route = createFileRoute("/library-admin/fines")({
  component: FinesPage
});
function FinesPage() {
  const totals = fines.reduce(
    (acc, f) => {
      acc[f.status] = (acc[f.status] ?? 0) + f.amount;
      return acc;
    },
    {}
  );
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader
    title="Fine Management"
    description="Track overdue fines, collect payments and issue waivers."
    icon={IndianRupee}
    tint="#EAB308"
    breadcrumbs={[{ label: "Fine Management" }]}
  />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
    { label: "Pending", value: totals.Pending ?? 0, tint: "#EAB308" },
    { label: "Paid", value: totals.Paid ?? 0, tint: "#22C55E" },
    { label: "Waived", value: totals.Waived ?? 0, tint: "#6B7280" }
  ].map((t) => <div key={t.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{t.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight" style={{ color: t.tint }}>
              ₹{t.value.toLocaleString("en-IN")}
            </p>
          </div>)}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Member</th>
                <th className="px-3 py-2 font-medium">Book</th>
                <th className="px-3 py-2 font-medium">Days Overdue</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fines.map((f) => <tr key={f.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="font-medium text-foreground">{f.member}</div>
                    <div className="text-xs text-muted-foreground">{f.memberId}</div>
                  </td>
                  <td className="px-3 py-3 text-foreground">{f.bookTitle}</td>
                  <td className="px-3 py-3 text-foreground">{f.daysOverdue} days</td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-foreground">
                    ₹{f.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-3"><LibraryStatusPill status={f.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {f.status === "Pending" && <>
                          <Button size="sm" className="h-8 bg-[#22C55E] hover:bg-[#16A34A]">
                            Collect
                          </Button>
                          <Button size="sm" variant="outline" className="h-8">
                            Waive
                          </Button>
                        </>}
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
export {
  Route
};

import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { myLibraryFines } from "@/lib/student-data";
const Route = createFileRoute("/student/library-fines")({
  head: () => ({ meta: [{ title: "Library Fines \u2014 Student Portal" }] }),
  component: FinesPage
});
function FinesPage() {
  const pending = myLibraryFines.filter((f) => f.status === "Pending").reduce((s, f) => s + f.amount, 0);
  const paid = myLibraryFines.filter((f) => f.status === "Paid").reduce((s, f) => s + f.amount, 0);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="Library Fines & Payments"
    description="Track and clear your library dues"
    icon={IndianRupee}
    tint="#EAB308"
    breadcrumbs={[{ label: "Library", to: "/student/books" }, { label: "Fines" }]}
  />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Pending fines</p>
          <p className="mt-2 text-3xl font-bold text-[#EF4444]">₹{pending.toLocaleString()}</p>
          <Button className="mt-4 bg-[#22C55E] hover:bg-[#16a34a]">Pay now</Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Total paid</p>
          <p className="mt-2 text-3xl font-bold text-[#22C55E]">₹{paid.toLocaleString()}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across all sessions</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">Fine history</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Days overdue</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myLibraryFines.map((f) => <tr key={f.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{f.book}</td>
                  <td className="px-4 py-3">{f.daysOverdue}</td>
                  <td className="px-4 py-3 font-semibold">₹{f.amount}</td>
                  <td className="px-4 py-3">{new Date(f.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><StatusPill status={f.status} /></td>
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

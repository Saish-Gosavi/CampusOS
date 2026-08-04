import { createFileRoute } from "@/routes/compat";
import { BookDown, Undo2 } from "lucide-react";
import { LibraryPageHeader } from "@/components/library/LibraryPageHeader";
import { LibraryStatusPill } from "@/components/library/LibraryStatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { issuedBooks } from "@/lib/library-data";
const Route = createFileRoute("/library-admin/return")({
  component: ReturnPage
});
function ReturnPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader
    title="Return Books"
    description="Check in returned copies and settle any pending fines."
    icon={BookDown}
    tint="#22C55E"
    breadcrumbs={[{ label: "Return Books" }]}
  />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
          <h2 className="text-base font-semibold text-foreground">Return a Copy</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Scan or enter accession number</p>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Accession</Label>
              <Input placeholder="e.g. ACC-00201" />
            </div>
            <div className="space-y-1.5">
              <Label>Return Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <Label>Condition Note</Label>
              <Input placeholder="Optional" />
            </div>
            <Button className="mt-2 w-full bg-[#22C55E] hover:bg-[#16A34A]">
              <Undo2 className="mr-1.5 h-4 w-4" /> Return Book
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between px-1 pb-3">
            <h2 className="text-base font-semibold text-foreground">Due Soon / Overdue</h2>
            <span className="text-xs text-muted-foreground">Sort by due date</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Member</th>
                  <th className="px-3 py-2 font-medium">Book</th>
                  <th className="px-3 py-2 font-medium">Due</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {issuedBooks.map((i) => <tr key={i.id} className="hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <div className="font-medium text-foreground">{i.member}</div>
                      <div className="text-xs text-muted-foreground">{i.memberId}</div>
                    </td>
                    <td className="px-3 py-3 text-foreground">{i.bookTitle}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-foreground">{i.dueDate}</td>
                    <td className="px-3 py-3"><LibraryStatusPill status={i.status} /></td>
                    <td className="px-3 py-3 text-right">
                      <Button size="sm" variant="outline" className="border-[#22C55E] text-[#16A34A] hover:bg-[#22C55E]/10">
                        Return
                      </Button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
}
export {
  Route
};

import { createFileRoute } from "@/routes/compat";
import { BookMarked, Bell, X } from "lucide-react";
import { LibraryPageHeader } from "@/components/library/LibraryPageHeader";
import { LibraryStatusPill } from "@/components/library/LibraryStatusPill";
import { Button } from "@/components/ui/button";
import { reservations } from "@/lib/library-data";
const Route = createFileRoute("/library-admin/reservations")({
  component: ReservationsPage
});
function ReservationsPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader
    title="Reservations"
    description="Manage active holds and notify members when copies are ready."
    icon={BookMarked}
    tint="#7B4CED"
    breadcrumbs={[{ label: "Reservations" }]}
  />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Member</th>
                <th className="px-3 py-2 font-medium">Book</th>
                <th className="px-3 py-2 font-medium">Reserved On</th>
                <th className="px-3 py-2 font-medium">Position</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reservations.map((r) => <tr key={r.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="font-medium text-foreground">{r.member}</div>
                    <div className="text-xs text-muted-foreground">{r.memberId}</div>
                  </td>
                  <td className="px-3 py-3 text-foreground">{r.bookTitle}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{r.reservedOn}</td>
                  <td className="px-3 py-3 font-medium text-foreground">#{r.position}</td>
                  <td className="px-3 py-3"><LibraryStatusPill status={r.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-8 border-[#7B4CED] text-[#7B4CED] hover:bg-[#7B4CED]/10">
                        <Bell className="mr-1 h-3.5 w-3.5" /> Notify
                      </Button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]">
                        <X className="h-4 w-4" />
                      </button>
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

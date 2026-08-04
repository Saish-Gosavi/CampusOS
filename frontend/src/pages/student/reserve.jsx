import { createFileRoute } from "@/routes/compat";
import { BookMarked } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/hostel/StatusPill";
import { libraryCatalog, myReservations } from "@/lib/student-data";
const Route = createFileRoute("/student/reserve")({
  head: () => ({ meta: [{ title: "Reserve Books \u2014 Student Portal" }] }),
  component: ReservePage
});
function ReservePage() {
  const available = libraryCatalog.filter((b) => b.copiesAvailable > 0);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="Reserve Books"
    description="Hold your next read from the library"
    icon={BookMarked}
    tint="#7B4CED"
    breadcrumbs={[{ label: "Library", to: "/student/books" }, { label: "Reserve" }]}
  />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Available to reserve</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {available.map((b) => <div key={b.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <span className="grid h-14 w-11 shrink-0 place-items-center rounded bg-gradient-to-br from-[#7B4CED] to-[#5b2fd0] text-sm font-bold text-white">
                {b.cover}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{b.title}</p>
                <p className="truncate text-xs text-muted-foreground">{b.author}</p>
                <p className="mt-1 text-xs text-[#22C55E] font-medium">{b.copiesAvailable} available</p>
              </div>
              <Button size="sm" className="bg-[#7B4CED] hover:bg-[#5b2fd0]">Reserve</Button>
            </div>)}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">My reservations</h3>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Book</th>
                  <th className="px-4 py-3 text-left">Reserved on</th>
                  <th className="px-4 py-3 text-left">Queue position</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myReservations.map((r) => <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{r.title}</td>
                    <td className="px-4 py-3">{new Date(r.reservedOn).toLocaleDateString()}</td>
                    <td className="px-4 py-3">#{r.position}</td>
                    <td className="px-4 py-3"><StatusPill status={r.status} /></td>
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

import { createFileRoute } from "@/routes/compat";
import { Armchair } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { myFurniture, studentProfile } from "@/lib/student-data";
const Route = createFileRoute("/student/furniture")({
  head: () => ({ meta: [{ title: "My Furniture \u2014 Student Portal" }] }),
  component: FurniturePage
});
function FurniturePage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="Furniture in My Room"
    description={`Assets assigned to ${studentProfile.hostel.room}`}
    icon={Armchair}
    tint="#EAB308"
    breadcrumbs={[{ label: "Hostel", to: "/student/room" }, { label: "Furniture" }]}
  />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Condition</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myFurniture.map((f) => <tr key={f.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{f.name}</td>
                  <td className="px-4 py-3">{f.quantity}</td>
                  <td className="px-4 py-3"><StatusPill status={f.condition} /></td>
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

import { createFileRoute } from "@tanstack/react-router";
import { UserCog, Plus, Pencil, Trash2, Phone } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { Button } from "@/components/ui/button";
import { staff } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/staff")({
  component: StaffPage
});
function StaffPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Staff Management"
    description="Wardens, security, cleaning and mess staff working across the hostel."
    icon={UserCog}
    tint="#3B82F6"
    breadcrumbs={[{ label: "Staff Management" }]}
    action={<Button className="bg-[#3B82F6] hover:bg-[#2563EB]">
            <Plus className="mr-1.5 h-4 w-4" /> Add Staff
          </Button>}
  />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">Assigned</th>
                <th className="px-3 py-2 font-medium">Contact</th>
                <th className="px-3 py-2 font-medium">Shift</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.map((s) => <tr key={s.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3B82F6]/10 text-xs font-semibold text-[#3B82F6]">
                        {s.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </span>
                      <span className="font-medium text-foreground">{s.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.role}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.block}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {s.contact}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.shift}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]">
                        <Trash2 className="h-4 w-4" />
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

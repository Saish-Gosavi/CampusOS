import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BedDouble, ListChecks, Repeat, History, Plus } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/hostel-admin/allocation")({
  component: AllocationLayout
});
const tabs = [
  { to: "/hostel-admin/allocation", label: "Allocation List", icon: ListChecks, exact: true },
  { to: "/hostel-admin/allocation/new", label: "Allocate Room", icon: Plus },
  { to: "/hostel-admin/allocation/change", label: "Room Change", icon: Repeat },
  { to: "/hostel-admin/allocation/history", label: "History", icon: History }
];
function AllocationLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Room Allocation"
    description="Assign students to available beds and manage room changes."
    icon={BedDouble}
    tint="#7B4CED"
    breadcrumbs={[{ label: "Room Allocation" }]}
    action={<Link to="/hostel-admin/allocation/new">
            <Button className="bg-[#7B4CED] hover:bg-[#6a3dd6]">
              <Plus className="mr-1.5 h-4 w-4" /> New Allocation
            </Button>
          </Link>}
  />

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {tabs.map((t) => {
    const active = t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(t.to + "/");
    return <Link
      key={t.to}
      to={t.to}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-[#7B4CED] text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
              <t.icon className="h-4 w-4" />
              {t.label}
            </Link>;
  })}
      </div>

      <Outlet />
    </div>;
}
export {
  Route
};

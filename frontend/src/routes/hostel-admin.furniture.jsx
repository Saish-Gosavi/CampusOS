import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Armchair, List, UserPlus, AlertTriangle, Wrench, RefreshCcw, Plus } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/hostel-admin/furniture")({
  component: FurnitureLayout
});
const TINT = "#7B4CED";
const tabs = [
  { to: "/hostel-admin/furniture", label: "Furniture List", icon: List, exact: true },
  { to: "/hostel-admin/furniture/assign", label: "Assign Furniture", icon: UserPlus },
  { to: "/hostel-admin/furniture/damaged", label: "Damaged Items", icon: AlertTriangle },
  { to: "/hostel-admin/furniture/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/hostel-admin/furniture/replacement", label: "Replacement", icon: RefreshCcw }
];
function FurnitureLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Furniture Management"
    description="Inventory, allocation, maintenance and replacement of hostel furniture."
    icon={Armchair}
    tint={TINT}
    breadcrumbs={[{ label: "Furniture" }]}
    action={<Link to="/hostel-admin/furniture/assign">
            <Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90">
              <Plus className="mr-1.5 h-4 w-4" /> Assign Item
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
        active ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      style={active ? { backgroundColor: TINT } : void 0}
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

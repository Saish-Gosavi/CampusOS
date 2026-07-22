import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  IndianRupee,
  LayoutDashboard,
  ListTree,
  FilePlus2,
  Clock,
  CheckCircle2,
  Receipt,
  History,
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hostel-admin/fees")({
  component: FeesLayout,
});

const tabs: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/hostel-admin/fees", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/hostel-admin/fees/structure", label: "Fee Structure", icon: ListTree },
  { to: "/hostel-admin/fees/generate", label: "Generate Fees", icon: FilePlus2 },
  { to: "/hostel-admin/fees/pending", label: "Pending Fees", icon: Clock },
  { to: "/hostel-admin/fees/paid", label: "Paid Fees", icon: CheckCircle2 },
  { to: "/hostel-admin/fees/receipts", label: "Receipts", icon: Receipt },
  { to: "/hostel-admin/fees/history", label: "Payment History", icon: History },
];

function FeesLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Fee Management"
        description="Track fee structure, collections, pending dues and receipts."
        icon={IndianRupee}
        tint="#22C55E"
        breadcrumbs={[{ label: "Fee Management" }]}
        action={
          <Link to="/hostel-admin/fees/generate">
            <Button className="bg-[#22C55E] hover:bg-[#16A34A]">
              <FilePlus2 className="mr-1.5 h-4 w-4" /> Generate Fees
            </Button>
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {tabs.map((t) => {
          const active = t.exact
            ? pathname === t.to
            : pathname === t.to || pathname.startsWith(t.to + "/");
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[#22C55E] text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}

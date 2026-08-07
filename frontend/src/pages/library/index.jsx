import React from "react";
import { createFileRoute } from "@/routes/compat";
import {
  BookOpen,
  BookCheck,
  BookUp,
  BookMarked,
  AlarmClock,
  Users,
  BookPlus,
  Undo2,
  Megaphone
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";

const Route = createFileRoute("/library-admin/")({
  component: LibraryDashboard
});

const stats = [
  { label: "Total Books", value: "0", delta: "Registered Catalog", trend: "up", icon: BookOpen, tint: "#0D9488" },
  { label: "Available Books", value: "0", delta: "On Shelves", trend: "up", icon: BookCheck, tint: "#22C55E" },
  { label: "Issued Books", value: "0", delta: "Currently Borrowed", trend: "up", icon: BookUp, tint: "#2563EB" },
  { label: "Reserved Books", value: "0", delta: "On Hold", trend: "up", icon: BookMarked, tint: "#7B4CED" },
  { label: "Overdue Books", value: "0", delta: "Pending Return", trend: "down", icon: AlarmClock, tint: "#EF4444" },
  { label: "Total Members", value: "0", delta: "Enrolled Members", trend: "up", icon: Users, tint: "#EAB308" }
];

const quickActions = [
  { title: "Add Book", description: "Catalog a new title", icon: BookPlus, tint: "#0D9488" },
  { title: "Issue Book", description: "Lend a copy to a member", icon: BookUp, tint: "#2563EB" },
  { title: "Return Book", description: "Check in a returned copy", icon: Undo2, tint: "#22C55E" },
  { title: "Create Notice", description: "Publish a library notice", icon: Megaphone, tint: "#EAB308" }
];

function LibraryDashboard() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Library Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Circulation, catalog and member activity at a glance.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          Library module active
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Common circulation tasks performed at the counter</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <QuickActionCard key={a.title} {...a} />
          ))}
        </div>
      </section>

      <ChartCard title="Library Catalog Overview" description="Registered books and circulation stats">
        <div className="flex h-48 flex-col items-center justify-center text-center p-4 text-muted-foreground">
          <BookOpen className="h-10 w-10 stroke-[1.5] mb-2 opacity-40 text-primary" />
          <p className="text-sm font-medium text-foreground">No Library Records Found</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
            Add books to your catalog to view circulation and category distributions.
          </p>
        </div>
      </ChartCard>
    </div>
  );
}

export { Route };

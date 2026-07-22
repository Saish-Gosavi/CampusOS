import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  tint: string;
}

export function StatCard({ label, value, delta, trend, icon: Icon, tint }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${tint}1A`, color: tint }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium">
        {trend === "up" ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-[#22C55E]" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 text-[#EF4444]" />
        )}
        <span className={cn(trend === "up" ? "text-[#22C55E]" : "text-[#EF4444]")}>{delta}</span>
      </div>
      <span
        className="absolute inset-x-0 bottom-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: tint }}
      />
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tint: string;
  onClick?: () => void;
}

export function QuickActionCard({ title, description, icon: Icon, tint, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-solid hover:shadow-md"
      style={{ ["--tint" as string]: tint }}
    >
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105"
        style={{ backgroundColor: `${tint}1A`, color: tint }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors group-hover:text-white"
        style={{ backgroundColor: "transparent" }}
      >
        <Plus
          className="h-4 w-4 transition-colors"
          style={{ color: "inherit" }}
        />
      </span>
    </button>
  );
}

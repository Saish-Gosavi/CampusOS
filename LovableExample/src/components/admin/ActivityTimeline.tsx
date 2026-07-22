import type { Activity } from "@/lib/admin-data";

export function ActivityTimeline({ items }: { items: Activity[] }) {
  return (
    <ol className="relative space-y-4 border-l border-dashed border-border pl-5">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            className="absolute -left-[30px] grid h-9 w-9 place-items-center rounded-full ring-4 ring-card"
            style={{ backgroundColor: `${item.tint}1A`, color: item.tint }}
          >
            <item.icon className="h-4 w-4" />
          </span>
          <div className="rounded-lg border border-border bg-background/60 p-3 transition-colors hover:bg-muted/40">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
              <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.meta}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

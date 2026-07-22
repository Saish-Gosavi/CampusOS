import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { LibraryPageHeader } from "./LibraryPageHeader";
import type { BreadcrumbItem } from "./LibraryBreadcrumbs";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  tint: string;
  breadcrumbs: BreadcrumbItem[];
}

export function LibraryPagePlaceholder({ title, description, icon, tint, breadcrumbs }: Props) {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader title={title} description={description} icon={icon} tint={tint} breadcrumbs={breadcrumbs} />
      <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
        <div className="max-w-md">
          <span
            className="mx-auto grid h-14 w-14 place-items-center rounded-2xl"
            style={{ backgroundColor: `${tint}1A`, color: tint }}
          >
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-foreground">Coming soon</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This module's UI shell is ready. Wire it to your backend to unlock full functionality.
          </p>
        </div>
      </div>
    </div>
  );
}

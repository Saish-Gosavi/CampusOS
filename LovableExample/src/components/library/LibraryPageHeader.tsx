import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { LibraryBreadcrumbs, type BreadcrumbItem } from "./LibraryBreadcrumbs";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  tint: string;
  breadcrumbs: BreadcrumbItem[];
  action?: ReactNode;
}

export function LibraryPageHeader({ title, description, icon: Icon, tint, breadcrumbs, action }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <LibraryBreadcrumbs items={breadcrumbs} />
        <div className="mt-3 flex items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
            style={{ backgroundColor: `${tint}1A`, color: tint }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      {action}
    </div>
  );
}

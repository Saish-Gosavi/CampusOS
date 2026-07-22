import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { WardenBreadcrumbs, type BreadcrumbItem } from "./WardenBreadcrumbs";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  tint: string;
  breadcrumbs: BreadcrumbItem[];
  action?: ReactNode;
}

export function WardenPageHeader({ title, description, icon: Icon, tint, breadcrumbs, action }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <WardenBreadcrumbs items={breadcrumbs} />
        <div className="mt-3 flex items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
            style={{ backgroundColor: `${tint}1A`, color: tint }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      {action}
    </div>
  );
}

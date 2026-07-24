import React from "react";
import { cn } from "@/lib/utils";

export function Header({ title, description, children, className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1 border-b border-border pb-5 md:flex-row md:items-center md:justify-between md:gap-4", className)} {...props}>
      <div className="space-y-0.5">
        {title && <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
}

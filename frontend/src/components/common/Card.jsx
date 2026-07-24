import React from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className, title, subtitle, headerAction, ...props }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div className="space-y-1">
            {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "No data found",
  description = "There are no records matching your query.",
  icon: Icon = AlertCircle,
  action,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-card/50 min-h-[300px]",
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className, variant = "default", ...props }) {
  const variants = {
    default: "bg-primary/10 text-primary hover:bg-primary/20",
    secondary: "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
    destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    success: "bg-success/10 text-success hover:bg-success/20",
    warning: "bg-warning/10 text-warning hover:bg-warning/20",
    outline: "text-foreground border border-border hover:bg-muted/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

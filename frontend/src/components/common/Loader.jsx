import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className, size = "default", label = "Loading...", ...props }) {
  const sizes = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 p-4", className)} {...props}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size] || sizes.default)} />
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  );
}

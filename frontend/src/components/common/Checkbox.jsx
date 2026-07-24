import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Checkbox = forwardRef(({
  label,
  error,
  className,
  id,
  ...rest
}, ref) => {
  const inputId = id || rest.name;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={cn(
            "h-4 w-4 rounded border-input text-primary focus:ring-primary/30 cursor-pointer",
            error && "border-destructive",
            className
          )}
          {...rest}
        />
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

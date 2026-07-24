import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef(({
  label,
  error,
  options = [],
  className,
  id,
  ...rest
}, ref) => {
  const inputId = id || rest.name;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          "block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
          error && "border-destructive focus:border-destructive focus:ring-destructive/20",
          className
        )}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";

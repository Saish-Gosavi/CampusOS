import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Radio = forwardRef(({
  label,
  error,
  options = [],
  className,
  id,
  ...rest
}, ref) => {
  const baseId = id || rest.name;

  return (
    <div className="space-y-2">
      {label && <span className="block text-sm font-medium text-foreground">{label}</span>}
      <div className={cn("flex flex-wrap gap-4", className)}>
        {options.map((opt, idx) => {
          const optId = `${baseId}-${idx}`;
          return (
            <div key={opt.value} className="flex items-center gap-2">
              <input
                ref={ref}
                type="radio"
                id={optId}
                value={opt.value}
                className="h-4 w-4 border-input text-primary focus:ring-primary/30 cursor-pointer"
                {...rest}
              />
              <label htmlFor={optId} className="text-sm font-medium text-foreground cursor-pointer select-none">
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

Radio.displayName = "Radio";

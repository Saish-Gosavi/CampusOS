import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, leftIcon, className, id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              leftIcon && "pl-10",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              className,
            )}
            aria-invalid={!!error}
            {...rest}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);
TextField.displayName = "TextField";

export const PasswordField = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, leftIcon, className, id, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id || rest.name;
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className={cn(
              "block w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              leftIcon && "pl-10",
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              className,
            )}
            aria-invalid={!!error}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-2 my-auto flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={visible ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);
PasswordField.displayName = "PasswordField";

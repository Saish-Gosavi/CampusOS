import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Unified reusable Input component
export const Input = forwardRef(({
  label,
  error,
  leftIcon,
  className,
  type = "text",
  options = [], // For select fields
  id,
  ...rest
}, ref) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputId = id || rest.name;

  const isPassword = type === "password";
  const actualType = isPassword && passwordVisible ? "text" : type;

  const renderInputField = () => {
    const commonClass = cn(
      "block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
      leftIcon && "pl-10",
      isPassword && "pr-10",
      error && "border-destructive focus:border-destructive focus:ring-destructive/20",
      className
    );

    if (type === "select") {
      return (
        <select ref={ref} id={inputId} className={commonClass} {...rest}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea ref={ref} id={inputId} className={commonClass} {...rest} />
      );
    }

    return (
      <input
        ref={ref}
        id={inputId}
        type={actualType}
        className={commonClass}
        aria-invalid={!!error}
        {...rest}
      />
    );
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            {leftIcon}
          </span>
        )}
        {renderInputField()}
        {isPassword && (
          <button
            type="button"
            onClick={() => setPasswordVisible((v) => !v)}
            className="absolute inset-y-0 right-2 my-auto flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

// Backward compatibility exports
export const TextField = Input;
export const PasswordField = forwardRef((props, ref) => (
  <Input ref={ref} type="password" {...props} />
));
PasswordField.displayName = "PasswordField";

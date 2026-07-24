import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Button({
  loading,
  disabled,
  children,
  className,
  variant = "primary",
  size = "default",
  leftIcon,
  rightIcon,
  ...rest
}) {
  const baseStyle = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover focus:ring-primary/30",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 focus:ring-primary/20",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus:ring-destructive/20",
    outline: "border border-input bg-background text-foreground hover:bg-accent focus:ring-primary/20",
    ghost: "text-foreground hover:bg-accent focus:ring-primary/20",
    link: "text-primary underline-offset-4 hover:underline focus:ring-0",
  };

  const sizes = {
    default: "px-4 py-2.5",
    sm: "h-9 rounded-md px-3 text-xs",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        baseStyle,
        variants[variant] || variants.primary,
        sizes[size] || sizes.default,
        className
      )}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}

// Preserve backward compatibility for SubmitButton export
export { Button as SubmitButton };

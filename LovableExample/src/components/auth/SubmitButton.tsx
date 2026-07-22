import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
}

export function SubmitButton({
  loading,
  disabled,
  children,
  className,
  variant = "primary",
  ...rest
}: SubmitButtonProps) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover focus:ring-primary/30",
    outline:
      "border border-input bg-background text-foreground hover:bg-accent focus:ring-primary/20",
    ghost: "text-foreground hover:bg-accent focus:ring-primary/20",
  } as const;

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

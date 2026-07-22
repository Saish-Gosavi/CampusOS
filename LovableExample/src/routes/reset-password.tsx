import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Lock, Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { authApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — CampusOS" }] }),
  component: ResetPasswordPage,
});

interface FormValues {
  password: string;
  confirm: string;
}

const rules = [
  { key: "length", label: "At least 8 characters", test: (s: string) => s.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (s: string) => /[A-Z]/.test(s) },
  { key: "lower", label: "One lowercase letter", test: (s: string) => /[a-z]/.test(s) },
  { key: "number", label: "One number", test: (s: string) => /\d/.test(s) },
  { key: "special", label: "One special character", test: (s: string) => /[^A-Za-z0-9]/.test(s) },
] as const;

function strengthLabel(score: number) {
  // Colors reference the portal palette: destructive, gold #EAB308, blue #3B82F6, green #22C55E
  if (score <= 1) return { label: "Weak", color: "var(--destructive)" };
  if (score <= 3) return { label: "Fair", color: "#EAB308" };
  if (score === 4) return { label: "Good", color: "#3B82F6" };
  return { label: "Strong", color: "#22C55E" };
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const password = watch("password") ?? "";
  const confirm = watch("confirm") ?? "";

  const checks = useMemo(() => rules.map((r) => ({ ...r, passed: r.test(password) })), [password]);
  const score = checks.filter((c) => c.passed).length;
  const strength = strengthLabel(score);

  const onSubmit = async (values: FormValues) => {
    if (score < 5) {
      toast.error("Password does not meet all requirements");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.resetPassword(values.password);
      toast.success("Password updated. Please sign in.");
      navigate({ to: "/login" });
    } catch {
      toast.error("Could not reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password to secure your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <PasswordField
          label="New password"
          placeholder="Enter new password"
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        {password.length > 0 && (
          <div className="space-y-3 rounded-lg border border-border bg-secondary/40 p-3">
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full transition-all"
                  style={{ width: `${(score / 5) * 100}%`, backgroundColor: strength.color }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">{strength.label}</span>
            </div>
            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {checks.map((c) => (
                <li
                  key={c.key}
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    c.passed ? "text-success" : "text-muted-foreground",
                  )}
                >
                  {c.passed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <PasswordField
          label="Confirm password"
          placeholder="Re-enter password"
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          error={errors.confirm?.message}
          {...register("confirm", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
        />

        {confirm && confirm === password && (
          <p className="flex items-center gap-1.5 text-xs text-success">
            <Check className="h-3.5 w-3.5" /> Passwords match
          </p>
        )}

        <SubmitButton loading={submitting} type="submit">
          {submitting ? "Updating…" : "Reset password"}
        </SubmitButton>

        <Link
          to="/login"
          className="block text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Back to login
        </Link>
      </form>
    </AuthLayout>
  );
}

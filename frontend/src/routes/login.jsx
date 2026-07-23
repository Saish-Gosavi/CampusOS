import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField, PasswordField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { authApi } from "@/lib/api";
const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in \u2014 CampusOS" },
      { name: "description", content: "Sign in to the College Management Portal." }
    ]
  }),
  component: LoginPage
});
function LoginPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { remember: true } });
  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await authApi.login(values);
      toast.success("Signed in successfully");
      navigate({ to: "/super-admin" });
    } catch {
      toast.error("Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return <AuthLayout title="Sign in to your account" subtitle="Access your college portal with your credentials.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <TextField
    label="Email or College ID"
    type="text"
    autoComplete="username"
    placeholder="name@college.edu"
    leftIcon={<Mail className="h-4 w-4" />}
    error={errors.email?.message}
    {...register("email", {
      required: "Email or College ID is required",
      validate: (v) => {
        if (!v.includes("@")) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address";
      }
    })}
  />

        <PasswordField
    label="Password"
    autoComplete="current-password"
    placeholder="••••••••"
    leftIcon={<Lock className="h-4 w-4" />}
    error={errors.password?.message}
    {...register("password", { required: "Password is required" })}
  />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
    type="checkbox"
    className="h-4 w-4 rounded border-input text-primary focus:ring-primary/30"
    {...register("remember")}
  />
            Remember me
          </label>
          <Link
    to="/forgot-password"
    className="text-sm font-medium text-primary hover:underline"
  >
            Forgot password?
          </Link>
        </div>

        <SubmitButton loading={submitting} type="submit">
          {submitting ? "Signing in\u2026" : "Sign in"}
        </SubmitButton>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have access?{" "}
          <span className="font-medium text-foreground">Contact Administrator.</span>
        </p>

        {
    /* Dev only helper to navigate to related pages */
  }
        <div className="hidden">
          <button type="button" onClick={() => navigate({ to: "/verify-otp" })} />
        </div>
      </form>
    </AuthLayout>;
}
export {
  Route
};

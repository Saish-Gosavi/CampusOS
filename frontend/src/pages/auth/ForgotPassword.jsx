import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      toast.success("OTP sent to your email");
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch {
      toast.error("Could not send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your registered email and we'll send a one-time password."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <TextField
          label="Email"
          type="email"
          placeholder="name@college.edu"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />

        <SubmitButton loading={submitting} type="submit">
          {submitting ? "Sending OTP…" : "Send OTP"}
        </SubmitButton>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </form>
    </AuthLayout>
  );
}

export const Route = { component: ForgotPasswordPage };

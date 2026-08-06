import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, UserPlus } from "lucide-react";
import { loginSchema } from "@/validations/schemas";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";

export function LoginForm({ onSubmit, loading }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email or College ID"
        type="text"
        autoComplete="username"
        placeholder="name@college.edu"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        leftIcon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
        {...register("password")}
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
        <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Forgot password?
        </a>
      </div>

      <Button loading={loading} type="submit" className="w-full">
        Sign in
      </Button>

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={() => navigate("/register")}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/10"
      >
        <UserPlus className="h-4 w-4" />
        New Hostel Registration
      </button>
    </form>
  );
}


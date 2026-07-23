import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, Users } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField, PasswordField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { authApi } from "@/lib/api";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("superadmin");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "", remember: true } });

  const rolesList = [
    { value: "superadmin", label: "Super Admin (All Modules)", email: "superadmin@college.edu" },
    { value: "admin", label: "Admin", email: "admin@college.edu" },
    { value: "warden", label: "Warden (Hostel)", email: "warden@college.edu" },
    { value: "librarian", label: "Librarian (Library)", email: "librarian@college.edu" },
    { value: "store", label: "Store Manager (Inventory)", email: "store@college.edu" },
    { value: "student", label: "Student", email: "student@college.edu" },
  ];

  const handleRoleSelect = (roleVal) => {
    setSelectedRole(roleVal);
    const roleInfo = rolesList.find((r) => r.value === roleVal);
    if (roleInfo) {
      setValue("email", roleInfo.email);
      setValue("password", "password");
    }
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await authApi.login(values);
      
      // Determine user role based on email or the selected helper
      let finalRole = selectedRole;
      const lowerEmail = values.email.toLowerCase();
      if (lowerEmail.includes("superadmin")) finalRole = "superadmin";
      else if (lowerEmail.includes("warden")) finalRole = "warden";
      else if (lowerEmail.includes("librarian")) finalRole = "librarian";
      else if (lowerEmail.includes("store")) finalRole = "store";
      else if (lowerEmail.includes("student")) finalRole = "student";
      else if (lowerEmail.includes("admin")) finalRole = "admin";

      const mockUserData = {
        id: 1,
        name: `${finalRole.charAt(0).toUpperCase() + finalRole.slice(1)} User`,
        email: values.email,
        role: finalRole,
      };
      
      const mockToken = "mocked-jwt-token-string";
      
      setAuthUser(mockUserData, mockToken);
      toast.success("Signed in successfully");

      // Redirect based on role
      if (finalRole === "librarian") {
        navigate("/library");
      } else if (finalRole === "store") {
        navigate("/inventory");
      } else {
        navigate("/hostel");
      }
    } catch (err) {
      toast.error("Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign in to your account" subtitle="Access your college portal with your credentials.">
      {/* Dev helper to choose a role */}
      <div className="mb-6 rounded-lg border border-border bg-muted/40 p-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Simulate Role Login (Dev Helper)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            <Users className="h-4 w-4" />
          </span>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleSelect(e.target.value)}
            className="block w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>Select a role...</option>
            {rolesList.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

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
            },
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
          {submitting ? "Signing in…" : "Sign in"}
        </SubmitButton>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have access?{" "}
          <span className="font-medium text-foreground">Contact Administrator.</span>
        </p>
      </form>
    </AuthLayout>
  );
}

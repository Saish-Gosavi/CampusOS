import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/forms/LoginForm";
import { authApi, tokenStorage } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const Route = {
  head: () => ({
    meta: [
      { title: "Sign in — CampusOS" },
      { name: "description", content: "Sign in to the College Management Portal." }
    ]
  }),
  component: LoginPage
};

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const response = await authApi.login(values);
      if (response.success && response.data) {
        const { user, tokens } = response.data;
        tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
        login(user, tokens.accessToken);
        toast.success("Signed in successfully");

        const role = user.role?.toLowerCase();
        if (role === "superadmin") navigate("/super-admin");
        else if (role === "admin") navigate("/hostel-admin");
        else if (role === "warden") navigate("/warden");
        else if (role === "librarian") navigate("/library-admin");
        else if (role === "store") navigate("/inventory-admin");
        else if (role === "student") navigate("/student");
        else navigate("/");
      } else {
        toast.error(response.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error(err.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign in to your account" subtitle="Access your college portal with your credentials.">
      <LoginForm onSubmit={onSubmit} loading={submitting} />
    </AuthLayout>
  );
}

export default LoginPage;
export { Route };

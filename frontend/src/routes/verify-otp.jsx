import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { authApi } from "@/lib/api";
const searchSchema = z.object({ email: z.string().optional() });
const Route = createFileRoute("/verify-otp")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "Verify OTP \u2014 CampusOS" }] }),
  component: VerifyOtpPage
});
const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;
function VerifyOtpPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1e3);
    return () => clearInterval(id);
  }, [seconds]);
  const focusInput = (idx) => inputsRef.current[idx]?.focus();
  const handleChange = (idx, value) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = clean;
      return next;
    });
    if (clean && idx < OTP_LENGTH - 1) focusInput(idx + 1);
  };
  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) focusInput(idx - 1);
    if (e.key === "ArrowLeft" && idx > 0) focusInput(idx - 1);
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) focusInput(idx + 1);
  };
  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    focusInput(Math.min(text.length, OTP_LENGTH - 1));
  };
  const otp = digits.join("");
  const onSubmit = async () => {
    setError(null);
    if (otp.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.verifyOtp(email ?? "", otp);
      toast.success("Code verified");
      navigate({ to: "/reset-password" });
    } catch {
      setError("Invalid or expired code");
    } finally {
      setSubmitting(false);
    }
  };
  const onResend = async () => {
    if (seconds > 0) return;
    await authApi.resendOtp(email ?? "");
    setSeconds(RESEND_SECONDS);
    toast.success("A new code was sent");
  };
  return <AuthLayout
    title="Verify your identity"
    subtitle={email ? `We sent a 6-digit code to ${email}.` : "Enter the 6-digit code sent to your email."}
  >
      <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="space-y-6"
  >
        <div className="flex justify-between gap-2 sm:gap-3">
          {digits.map((digit, idx) => <input
    key={idx}
    ref={(el) => {
      inputsRef.current[idx] = el;
    }}
    value={digit}
    onChange={(e) => handleChange(idx, e.target.value)}
    onKeyDown={(e) => handleKeyDown(idx, e)}
    onPaste={handlePaste}
    inputMode="numeric"
    autoComplete="one-time-code"
    maxLength={1}
    className="h-12 w-full rounded-lg border border-input bg-background text-center text-xl font-semibold text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 sm:h-14"
    aria-label={`Digit ${idx + 1}`}
  />)}
        </div>

        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <SubmitButton loading={submitting} type="submit">
          {submitting ? "Verifying\u2026" : "Verify code"}
        </SubmitButton>

        <div className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive it?{" "}
          {seconds > 0 ? <span>
              Resend in <span className="font-medium text-foreground">{seconds}s</span>
            </span> : <button
    type="button"
    onClick={onResend}
    className="font-medium text-primary hover:underline"
  >
              Resend OTP
            </button>}
        </div>
      </form>
    </AuthLayout>;
}
export {
  Route
};

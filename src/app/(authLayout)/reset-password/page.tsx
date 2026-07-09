"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import ShimmerText from "@/components/modules/shared/ShimmerText";
import HoverButton from "@/components/modules/shared/HoverButton";
import { Label } from "@/components/ui/label";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.emailOtp.resetPassword({
        email,
        otp,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password");
        return;
      }

      toast.success(
        // "Password reset successful! You can now login with your new password.",
        "Password reset successful!",
      );
      router.push("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("An error occurred during password reset");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-[#111116] border border-zinc-100 dark:border-zinc-800/40 rounded-3xl p-8 shadow-xs select-none">
      {/* Header */}
      <div className="mb-8">
        <ShimmerText className="mb-3">Secure Reset</ShimmerText>
        <h2 className="text-3xl font-clash font-medium tracking-tight text-secondary leading-tight">
          Reset Password
        </h2>
        <p className="text-sm text-text-primary mt-1">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-secondary">{email}</span> and your
          new password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleReset} className="space-y-4">
        {/* OTP Field */}
        <div className="space-y-0">
          <Label className="text-sm leading-4 font-medium text-secondary mb-1.5 block">
            Verification Code
          </Label>
          <Input
            id="otp"
            type="text"
            placeholder="000000"
            className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 h-10 rounded-xl text-base tracking-[0.5em] font-bold text-center transition-all focus-visible:ring-2"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            disabled={isLoading}
            required
          />
        </div>

        {/* New Password */}
        <div className="space-y-0">
          <Label className="text-sm leading-4 font-medium text-secondary mb-1.5 block">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 h-10 rounded-xl text-base tracking-wide pl-9 pr-10 py-2 transition-all focus-visible:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-text-primary/50 hover:text-text-primary transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-0">
          <Label className="text-sm leading-4 font-medium text-secondary mb-1.5 block">
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 h-10 rounded-xl text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="pt-1">
          <HoverButton
            type="submit"
            loading={isLoading}
            className="w-full justify-center"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </HoverButton>
        </div>
      </form>

      {/* Footer */}
      <p className="text-sm text-center mt-6">
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Back to Login
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Suspense
        fallback={
          <Card className="w-full max-w-lg mx-auto border-zinc-100 dark:border-zinc-800/40 rounded-3xl">
            <CardContent className="flex items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </CardContent>
          </Card>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}

"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.changePassword({
        newPassword: newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-[#111116] border border-zinc-100 dark:border-zinc-800/40 rounded-xl p-8 shadow-xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-clash font-medium tracking-tight text-primary leading-tight flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-primary" />
          Change Password
        </h2>
        <p className="text-sm text-text-primary mt-1">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-0">
          <label className="text-sm leading-4 font-medium text-primary mb-1.5 block">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
            <Input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-10 py-2 transition-all focus-visible:ring-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-3 text-text-primary/50 hover:text-text-primary transition-colors"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-0">
          <label className="text-sm leading-4 font-medium text-primary mb-1.5 block">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-10 py-2 transition-all focus-visible:ring-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-3 text-text-primary/50 hover:text-text-primary transition-colors"
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-0">
          <label className="text-sm leading-4 font-medium text-primary mb-1.5 block">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-10 py-2 transition-all focus-visible:ring-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-text-primary/50 hover:text-text-primary transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full justify-center"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Updating...</span>
              </div>
            ) : (
              <>
                <KeyRound className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

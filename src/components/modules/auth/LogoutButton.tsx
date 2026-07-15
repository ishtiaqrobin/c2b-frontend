/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { env } from "@/env";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
  className?: string;
  showIcon?: boolean;
  size?: "lg" | "md" | "sm" | "icon";
}

export function LogoutButton({
  variant = "outline",
  className,
  size = "sm",
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // 1. Call server-side logout to revoke session in DB
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // 2. Call better-auth client-side sign out
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.refresh();
            setTimeout(() => {
              window.location.href = "/";
            }, 100);
          },
          onError: (ctx: any) => {
            toast.error("Logout failed");
            console.error("Logout error:", ctx.error);
            setIsLoading(false);
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
      // size={size}
    >
      <LogOutIcon className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}

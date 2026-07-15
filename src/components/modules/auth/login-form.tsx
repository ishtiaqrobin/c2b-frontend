"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { IUser } from "@/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import HoverButton from "../shared/HoverButton";
import ShimmerText from "../shared/ShimmerText";
import { Button } from "@/components/ui/button";

export function LoginForm({ ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.code === "EMAIL_NOT_VERIFIED") {
          toast.info("Please verify your email.");
          router.push(
            `/verify-email?email=${encodeURIComponent(values.email)}`,
          );
          return;
        }

        toast.error(error.message || "Login failed");
        return;
      }

      toast.success("Login successful!");

      const userData = data?.user as unknown as IUser | undefined;

      if (userData?.userType === "STAFF" || userData?.isSuperOwner) {
        router.push("/admin-dashboard");
      } else if (
        userData?.userType === "CUSTOMER" ||
        userData?.userType === "MERCHANT"
      ) {
        router.push("/user-dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-lg mx-auto bg-white dark:bg-[#111116] border border-zinc-100 dark:border-zinc-800/40 rounded-xl p-8 shadow-xl"
      {...props}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-clash font-medium tracking-tight text-primary leading-tight">
          Login to your account
        </h2>
        <p className="text-sm text-text-primary mt-1">
          Enter your email below to login to your account
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="text-sm leading-4 font-medium text-primary mb-1.5 block">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                    <Input
                      placeholder="your@email.com"
                      className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-3 py-2 transition-all focus-visible:ring-2"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500 font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <div className="flex items-center justify-between mb-1.5">
                  <FormLabel className="text-sm leading-4 font-medium text-primary">
                    Password
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-text-primary/50" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-[#111116] border-zinc-200/80 dark:border-zinc-800/80 text-base tracking-wide pl-9 pr-10 py-2 transition-all focus-visible:ring-2"
                      disabled={isLoading}
                      {...field}
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
                </FormControl>
                <FormMessage className="text-xs text-red-500 font-medium" />
              </FormItem>
            )}
          />

          <div className="pt-1">
            <Button
              type="submit"
              // loading={isLoading}
              className="w-full justify-center"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span className="">Loading...</span>
                </div>
              ) : (
                <>Login</>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-sm text-center text-text-primary mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary hover:underline font-medium"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

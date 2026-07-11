"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function loginForm() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 font-sans">
      <div className="w-full max-w-[400px]">
        {/* Title */}
        <h1 className="text-3xl md:text-[32px] font-bold text-center mb-8 text-black">
          Log in
        </h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Email Input */}
          <div>
            <Input
              type="email"
              placeholder="email address"
              className="h-12 rounded-none border-gray-400 focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black text-base placeholder:text-gray-400"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <Input
              type="password"
              placeholder="password"
              className="h-12 rounded-none border-gray-400 focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black text-base placeholder:text-gray-400"
              required
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2 pt-1 pb-2">
            <Checkbox
              id="remember"
              className="rounded-none border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none cursor-pointer text-gray-700 select-none"
            >
              Log in automatically next time.
            </label>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#444444] hover:bg-[#2d2d2d] text-white rounded-none text-base font-medium transition-colors"
          >
            Log in
          </Button>

          {/* Links Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 gap-3 sm:gap-0 text-sm text-black">
            <Link
              href="/password-reset"
              className="underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              Password Reset
            </Link>
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              New Member Registration
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

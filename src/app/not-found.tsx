import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute -inset-4 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <h1 className="relative text-9xl font-extrabold tracking-tighter ">
          404
        </h1>
      </div>

      <div className="max-w-md">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops! Page not found
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button className="cursor-pointer">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="outline" className="cursor-pointer">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 text-sm text-muted-foreground/60">
        © {new Date().getFullYear()} Kroy dot. All rights reserved.
      </div>
    </div>
  );
}

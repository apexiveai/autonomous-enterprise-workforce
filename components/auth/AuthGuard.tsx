"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/providers/AuthProvider";

const PUBLIC_ROUTES = new Set(["/login", "/register"]);

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, error, retry } = useAuth();
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);

  useEffect(() => {
    if (!isPublicRoute && !loading && !error && !user) {
      router.replace("/login");
    }
  }, [error, isPublicRoute, loading, router, user]);

  if (isPublicRoute) {
    return children;
  }

  if (loading || (!user && !error)) {
    return (
      <main className="flex min-h-screen items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking your session...
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900">
          Could not restore your session
        </h1>
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={retry}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
          <Link
            href="/login"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return user ? children : null;
}

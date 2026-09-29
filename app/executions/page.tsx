"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { getExecutions } from "@/lib/api";
import type { Execution } from "@/lib/types";

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getExecutions()
      .then(setExecutions)
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Unable to load executions.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Runtime
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Executions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor autonomous workflow runs.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {loading ? <p className="p-6 text-sm text-slate-500">Loading executions...</p> : null}
          {error ? <p className="p-6 text-sm text-red-600">{error}</p> : null}
          {!loading && !error && executions.length === 0 ? (
            <div className="p-6">
              <p className="text-sm text-slate-500">No executions found.</p>
              <div className="mt-5">
                <Link href="/dashboard" className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
                  Start an execution
                </Link>
              </div>
            </div>
          ) : null}
          {executions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {executions.map((execution) => (
                <Link key={execution.run_id} href={`/executions/${execution.run_id}`} className="block p-5 hover:bg-slate-50">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{execution.goal}</p>
                      <p className="mt-1 text-xs text-slate-400">{execution.run_id}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-600">{execution.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
          <div className="p-6 pt-0">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-slate-600 underline"
            >
              Back to dashboard
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

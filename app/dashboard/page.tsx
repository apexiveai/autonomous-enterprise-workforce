"use client";

import Link from "next/link";
import { Activity, ArrowRight, Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ExecuteWork } from "@/components/dashboard/execute-work";
import { getApprovals, getAuditEvents } from "@/lib/api";
import type { Approval, AuditEvent } from "@/lib/types";

export default function DashboardPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const [approvalData, auditData] = await Promise.all([
          getApprovals(controller.signal),
          getAuditEvents(controller.signal),
        ]);
        setApprovals(
          approvalData.filter((approval) => approval.status === "pending"),
        );
        setEvents(auditData.slice(0, 5));
        setError(null);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load dashboard data.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [refreshCount]);

  return (
    <AppShell>
      <div className="space-y-8">
        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Execution Control
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Command Center
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Start governed enterprise work and review live approval and audit
            activity from the connected API.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setRefreshCount((count) => count + 1)}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <ExecuteWork />

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Pending approvals
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Current requests from the API
                </p>
              </div>
              <ShieldAlert className="h-4 w-4 text-slate-400" />
            </div>
            <div className="p-5">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading approvals...
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-slate-950">
                    {approvals.length}
                  </p>
                  <Link
                    href="/approvals"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-950"
                  >
                    Open approval console <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Recent audit activity
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Latest events returned by the API
                </p>
              </div>
              <Activity className="h-4 w-4 text-slate-400" />
            </div>
            {loading ? (
              <div className="flex items-center gap-2 p-5 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading activity...
              </div>
            ) : events.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">
                No audit events were returned.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-5 py-3"
                  >
                    <span className="font-mono text-xs text-slate-700">
                      {event.action}
                    </span>
                    <time
                      dateTime={event.created_at}
                      className="text-[10px] text-slate-400"
                    >
                      {new Date(event.created_at).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <Link
                href="/audit"
                className="text-xs font-semibold text-slate-700 hover:text-slate-950"
              >
                View audit log
              </Link>
              <button
                type="button"
                aria-label="Refresh dashboard data"
                onClick={() => setRefreshCount((count) => count + 1)}
                disabled={loading}
                className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

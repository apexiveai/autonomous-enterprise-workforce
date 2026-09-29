"use client";

import { CheckCircle2, CircleDot, Loader2, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { getAuditEvents } from "@/lib/api";
import type { AuditEvent } from "@/lib/types";

function eventIcon(action: string) {
  const normalized = action.toLowerCase();
  if (normalized.includes("reject") || normalized.includes("fail")) {
    return XCircle;
  }
  if (normalized.includes("approval") || normalized.includes("policy")) {
    return ShieldCheck;
  }
  return CheckCircle2;
}

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        setEvents(await getAuditEvents(controller.signal));
        setError(null);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load audit events.",
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
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Governance
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Audit Log
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Execution and governance activity returned by the audit API.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRefreshCount((count) => count + 1)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </header>

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

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading audit events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No audit events were returned.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Resource</th>
                  <th className="px-5 py-3">Run</th>
                  <th className="px-5 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => {
                  const Icon = eventIcon(event.action);
                  const resource =
                    event.details &&
                    typeof event.details === "object" &&
                    "tool_name" in event.details
                      ? String(event.details.tool_name)
                      : event.resource_id || event.resource_type;
                  return (
                    <tr key={event.id} className="text-xs text-slate-600">
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                          <span className="font-mono text-[10px] font-semibold text-slate-700">
                            {event.action}
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-4">{resource}</td>
                      <td className="px-5 py-4 font-mono text-[10px] text-slate-500">
                        {event.workflow_run_id || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-slate-500">
                          <CircleDot className="h-3 w-3" />
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

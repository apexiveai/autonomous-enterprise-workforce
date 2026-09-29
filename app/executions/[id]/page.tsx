"use client";

import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { getExecution } from "@/lib/api";
import type { Execution } from "@/lib/types";

function statusClass(status: string) {
  if (status === "completed") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "waiting_approval" || status === "pending_approval") {
    return "bg-amber-50 text-amber-700";
  }
  if (status === "failed" || status === "rejected") {
    return "bg-red-50 text-red-700";
  }
  return "bg-blue-50 text-blue-700";
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString() : "Not available";
}

export default function ExecutionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [execution, setExecution] = useState<Execution | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timer: number | undefined;

    async function load() {
      try {
        const data = await getExecution(id, controller.signal);
        if (controller.signal.aborted) {
          return;
        }

        setExecution(data);
        setError("");
        setLoading(false);

        if (!["completed", "failed", "rejected"].includes(data.status)) {
          timer = window.setTimeout(() => void load(), 2000);
        }
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load execution.",
          );
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      controller.abort();
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [id, refreshCount]);

  if (loading && !execution) {
    return (
      <AppShell>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading execution...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <Link
          href="/executions"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to executions
        </Link>

        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setRefreshCount((count) => count + 1);
              }}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {execution && (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="break-all font-mono text-xs text-slate-400">
                      {execution.run_id}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusClass(execution.status)}`}
                    >
                      {execution.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <h1 className="mt-4 max-w-3xl break-words text-2xl font-bold tracking-tight text-slate-950">
                    {execution.goal}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => setRefreshCount((count) => count + 1)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </button>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-900">
                  Execution details
                </h2>
                <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Info label="Thread" value={execution.thread_id || "Not available"} />
                  <Info label="Created" value={formatDate(execution.created_at)} />
                  <Info label="Started" value={formatDate(execution.started_at)} />
                  <Info label="Completed" value={formatDate(execution.completed_at)} />
                  <Info
                    label="Approval request"
                    value={execution.approval_request_id || "None"}
                  />
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-900">
                  Result
                </h2>
                {execution.error && (
                  <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {execution.error}
                  </p>
                )}
                {execution.result ? (
                  <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                    {JSON.stringify(execution.result, null, 2)}
                  </pre>
                ) : !execution.error ? (
                  <p className="mt-3 text-sm text-slate-500">
                    No result has been returned yet.
                  </p>
                ) : null}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 break-all text-xs font-medium text-slate-700">
        {value}
      </dd>
    </div>
  );
}

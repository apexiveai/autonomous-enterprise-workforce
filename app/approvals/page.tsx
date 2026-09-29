"use client";

import {
  CheckCircle2,
  Loader2,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  approveExecution,
  getApprovals,
  rejectExecution,
} from "@/lib/api";
import type { Approval } from "@/lib/types";

const APPROVAL_ROLES = new Set([
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "MANAGER",
  "APPROVER",
]);

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const requestController = useRef<AbortController | null>(null);
  const canDecide = Boolean(user && APPROVAL_ROLES.has(user.role));

  const reload = useCallback(() => setRefreshCount((count) => count + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let timer: number | undefined;
    let refreshing = false;

    async function refresh(showLoading: boolean) {
      if (refreshing || controller.signal.aborted) {
        return;
      }
      refreshing = true;
      if (showLoading) {
        setLoading(true);
      }

      try {
        const result = await getApprovals(controller.signal);
        setApprovals(result.filter((approval) => approval.status === "pending"));
        setError(null);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load approvals.",
          );
        }
      } finally {
        refreshing = false;
        if (!controller.signal.aborted) {
          setLoading(false);
          timer = window.setTimeout(() => void refresh(false), 10000);
        }
      }
    }

    void refresh(true);
    return () => {
      controller.abort();
      requestController.current?.abort();
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [refreshCount]);

  async function decide(id: string, approved: boolean) {
    const controller = new AbortController();
    requestController.current = controller;
    setBusy(id);
    setError(null);

    try {
      if (approved) {
        await approveExecution(id, undefined, controller.signal);
      } else {
        await rejectExecution(id, undefined, controller.signal);
      }
      reload();
    } catch (decisionError) {
      if (!controller.signal.aborted) {
        setError(
          decisionError instanceof Error
            ? decisionError.message
            : "Failed to update approval.",
        );
      }
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
        setBusy(null);
      }
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Governance
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Approval Console
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review pending high-risk actions before execution.
          </p>
        </header>

        {!canDecide && user && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Your {user.role} role can review requests but cannot approve or
            reject them. Contact an administrator or approver.
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={reload}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading approvals...
          </div>
        ) : approvals.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center sm:p-12">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
            <h2 className="mt-4 text-sm font-semibold text-slate-900">
              No pending approvals
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Pending requests from the API will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <article
                key={approval.id}
                className="rounded-2xl border border-amber-200 bg-white p-4 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="h-fit rounded-xl bg-amber-50 p-3">
                      <ShieldAlert className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="break-all text-sm font-semibold text-slate-900">
                          {approval.tool_name}
                        </h2>
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700">
                          {approval.risk_level} risk
                        </span>
                      </div>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        {approval.reason}
                      </p>
                      <p className="mt-2 break-all font-mono text-[10px] text-slate-400">
                        Run {approval.workflow_run_id}
                      </p>
                    </div>
                  </div>

                  {canDecide && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => void decide(approval.id, false)}
                        disabled={busy !== null}
                        className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => void decide(approval.id, true)}
                        disabled={busy !== null}
                        className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                      >
                        {busy === approval.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Approve
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Arguments
                  </p>
                  <pre className="overflow-auto whitespace-pre-wrap break-all text-[11px] text-slate-600">
                    {JSON.stringify(approval.arguments, null, 2)}
                  </pre>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

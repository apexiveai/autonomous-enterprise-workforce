import { Bot } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";

export default function AgentsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Workforce
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Agents
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Agent inventory and live runtime status.
          </p>
        </header>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <Bot className="h-7 w-7 text-slate-500" />
          <h2 className="mt-4 text-base font-semibold text-slate-900">
            Agent inventory is not exposed by the current API
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This workspace does not currently provide an agent-list or runtime
            status endpoint. Agent names and online states are omitted rather
            than presented as live system data.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Start an execution
          </Link>
        </section>
      </div>
    </AppShell>
  );
}

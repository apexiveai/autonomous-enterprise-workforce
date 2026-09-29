"use client";

import {

  ArrowUpRight,

  Loader2,

  Sparkles,

} from "lucide-react";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createExecution } from "@/lib/api";

export function ExecuteWork() {

  const router = useRouter();

  const [goal, setGoal] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(

    event: React.FormEvent

  ) {

    event.preventDefault();

    if (!goal.trim()) {

      setError("Please enter a work objective.");

      return;

    }

    setLoading(true);

    setError("");

    try {

      const execution =

        await createExecution(

          goal.trim()

        );

      router.push(

        `/executions/${execution.run_id}`

      );

    } catch (err) {

      setError(

        err instanceof Error

          ? err.message

          : "Failed to create execution."

      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-slate-950 p-2">

            <Sparkles className="h-4 w-4 text-white" />

          </div>

          <div>

            <h2 className="text-sm font-semibold text-slate-950">

              Execute Enterprise Work

            </h2>

            <p className="mt-1 text-xs text-slate-400">

              Describe the outcome. Agents will plan,

              execute and verify the work.

            </p>

          </div>

        </div>

      </div>

      <form

        onSubmit={handleSubmit}

        className="p-6"

      >

        <textarea

          value={goal}

          onChange={(event) =>

            setGoal(event.target.value)

          }

          rows={4}

          placeholder="Describe the work you want the autonomous workforce to execute..."

          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"

        />

        {error && (

          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">

            {error}

          </div>

        )}

        <div className="mt-4 flex items-center justify-between">

          <p className="text-[11px] text-slate-400">

            Execution is governed by policy,

            permissions and approval gates.

          </p>

          <button

            type="submit"

            disabled={loading}

            className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"

          >

            {loading ? (

              <Loader2 className="h-4 w-4 animate-spin" />

            ) : (

              <ArrowUpRight className="h-4 w-4" />

            )}

            {loading

              ? "Starting..."

              : "Execute Work"}

          </button>

        </div>

      </form>

    </section>

  );

}
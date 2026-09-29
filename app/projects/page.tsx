"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getProjects, type Project } from "@/lib/community-api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        setProjects(await getProjects(controller.signal));
        setError(null);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load projects.",
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Community
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Projects
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Discover projects built by your enterprise community.
          </p>
        </div>
        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading projects...
          </div>
        ) : !error && projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            No projects have been published yet.
          </div>
        ) : null}
        {!loading && !error && <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-base font-semibold text-slate-900">{project.name}</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-500">
                  {project.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">{project.description}</p>
              <div className="mt-5 flex gap-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
                <span>{project.category}</span>
                <span>{project.stars} stars</span>
                <span>{project.views} views</span>
              </div>
            </article>
          ))}
        </div>}
      </div>
    </AppShell>
  );
}

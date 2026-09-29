"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  type Category,
  createThread,
  getCategories,
  getThreads,
  type Thread,
} from "@/lib/community-api";

export default function ForumsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const postingController = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const [loadedCategories, loadedThreads] = await Promise.all([
          getCategories(controller.signal),
          getThreads(undefined, controller.signal),
        ]);
        if (controller.signal.aborted) {
          return;
        }
        setCategories(loadedCategories);
        setSelectedCategory(loadedCategories[0]?.id || "");
        setThreads(loadedThreads);
        setError(null);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load community discussions.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      controller.abort();
      postingController.current?.abort();
    };
  }, [refreshCount]);

  const visibleThreads = selectedCategory
    ? threads.filter((thread) => thread.category_id === selectedCategory)
    : threads;

  async function submitThread(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPosting(true);
    setError(null);
    const controller = new AbortController();
    postingController.current = controller;
    try {
      const thread = await createThread({
        title,
        content,
        category_id: selectedCategory,
      }, controller.signal);
      setThreads((current) => [thread, ...current]);
      setTitle("");
      setContent("");
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "Unable to publish discussion.");
      }
    } finally {
      if (postingController.current === controller) {
        postingController.current = null;
        setPosting(false);
      }
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Community
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Forums</h1>
          <p className="mt-2 text-sm text-slate-500">
            Discuss ideas, share knowledge, and get help from the workforce community.
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
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Categories</h2>
            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-500">Loading categories...</p>
              ) : categories.length === 0 && !error ? (
                <p className="text-sm text-slate-500">No categories have been created yet.</p>
              ) : null}
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={[
                    "w-full rounded-xl p-3 text-left transition",
                    selectedCategory === category.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 hover:bg-slate-100",
                  ].join(" ")}
                >
                  <p className={selectedCategory === category.id ? "text-sm font-medium text-white" : "text-sm font-medium text-slate-800"}>{category.name}</p>
                  <p className={selectedCategory === category.id ? "mt-1 text-xs text-slate-300" : "mt-1 text-xs text-slate-500"}>{category.description}</p>
                </button>
              ))}
            </div>
          </section>
          <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Recent discussions</h2>
            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-sm text-slate-500">Loading discussions...</p>
              ) : visibleThreads.length === 0 && !error ? (
                <p className="text-sm text-slate-500">No discussions have been started yet.</p>
              ) : null}
              {visibleThreads.map((thread) => (
                <article key={thread.id} className="rounded-xl border border-slate-100 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">{thread.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{thread.content}</p>
                  <p className="mt-3 text-xs text-slate-400">{thread.views} views</p>
                </article>
              ))}
            </div>
          </section>
        </div>
        <form onSubmit={submitThread} className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">Start a discussion</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              required
              disabled={loading || !selectedCategory}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Discussion title"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
            <select
              required
              disabled={loading || categories.length === 0}
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <textarea
            required
            disabled={loading || !selectedCategory}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your question, idea, or knowledge..."
            rows={4}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          <button
            type="submit"
            disabled={posting || loading || !selectedCategory}
            className="mt-3 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {posting ? "Publishing..." : "Publish discussion"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}

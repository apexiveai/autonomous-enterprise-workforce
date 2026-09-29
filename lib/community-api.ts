import { apiRequest } from "./http";

export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  repository_url: string | null;
  website_url: string | null;
  status: string;
  stars: number;
  views: number;
  is_featured: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Thread = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  author_id: string | null;
  views: number;
};

export type Reply = {
  id: string;
  thread_id: string;
  author_id: string | null;
  content: string;
};

export const getProjects = (signal?: AbortSignal) =>
  apiRequest<Project[]>("/api/projects", { signal });

export const getCategories = (signal?: AbortSignal) =>
  apiRequest<Category[]>("/api/categories", { signal });

export const getThreads = (
  categoryId?: string,
  signal?: AbortSignal,
) =>
  apiRequest<Thread[]>(
    categoryId
      ? `/api/threads?category_id=${encodeURIComponent(categoryId)}`
      : "/api/threads",
    { signal },
  );

export const getReplies = (threadId: string, signal?: AbortSignal) =>
  apiRequest<Reply[]>(
    `/api/threads/${encodeURIComponent(threadId)}/replies`,
    { signal },
  );

export const createThread = (
  payload: {
    title: string;
    content: string;
    category_id: string;
  },
  signal?: AbortSignal,
) =>
  apiRequest<Thread>("/api/threads", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });

import { API_BASE_URL } from "@/lib/config";

const ACCESS_TOKEN_KEY = "apexive_access_token";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiRequestOptions = RequestInit & {
  token?: string | null;
};

function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getErrorMessage(data: unknown): string {
  if (typeof data === "string" && data) {
    return data;
  }

  if (data && typeof data === "object") {
    for (const key of ["detail", "error", "message"] as const) {
      const value = Reflect.get(data, key);
      if (typeof value === "string" && value) {
        return value;
      }
    }
  }

  return "Request failed.";
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token: explicitToken, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);
  const body = requestOptions.body;

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Authorization")) {
    const token =
      explicitToken === undefined ? getAccessToken() : explicitToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers,
    cache: requestOptions.cache ?? "no-store",
  });

  if (response.status === 204) {
    if (!response.ok) {
      throw new ApiError("Request failed.", response.status);
    }
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  const data: unknown = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data), response.status);
  }

  return data as T;
}

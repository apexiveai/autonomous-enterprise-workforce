const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (process.env.NODE_ENV === "production" && !configuredApiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL must be set in production.");
}

const apiUrl = configuredApiUrl || "http://127.0.0.1:8004";

try {
  const parsedApiUrl = new URL(apiUrl);
  if (!["http:", "https:"].includes(parsedApiUrl.protocol)) {
    throw new Error("NEXT_PUBLIC_API_URL must use HTTP or HTTPS.");
  }
} catch (error) {
  throw new Error(
    "NEXT_PUBLIC_API_URL must be a valid absolute HTTP(S) URL.",
    { cause: error },
  );
}

export const API_BASE_URL = apiUrl.replace(/\/+$/, "");

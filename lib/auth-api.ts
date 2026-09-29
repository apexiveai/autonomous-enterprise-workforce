import type {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RegisterRequest,
} from "@/types/auth";
import { apiRequest } from "@/lib/http";

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const payload: LoginRequest = {
    email: email.trim().toLowerCase(),
    password,
  };

  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
    token: null,
  });
}

export async function register(
  organizationName: string,
  organizationSlug: string,
  fullName: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const payload: RegisterRequest = {
    organization_name: organizationName.trim(),
    organization_slug: organizationSlug.trim().toLowerCase(),
    full_name: fullName.trim(),
    email: email.trim().toLowerCase(),
    password,
  };

  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    token: null,
  });
}

export async function getMe(
  token: string,
  signal?: AbortSignal,
): Promise<MeResponse> {
  return apiRequest<MeResponse>("/auth/me", {
    method: "GET",
    token,
    signal,
  });
}

export type UserRole =
  | "SUPER_ADMIN"
  | "ORG_ADMIN"
  | "MANAGER"
  | "APPROVER"
  | "USER"
  | "AGENT";

export interface User {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  role: UserRole | string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

export interface RegisterRequest {
  organization_name: string;
  organization_slug: string;
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
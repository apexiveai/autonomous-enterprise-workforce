"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { User } from "@/types/auth";
import { getMe, login as loginApi, register as registerApi } from "@/lib/auth-api";
import { ApiError } from "@/lib/http";

const ACCESS_TOKEN_KEY = "apexive_access_token";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
  login: (email: string, password: string) => Promise<User>;
  register: (
    organizationName: string,
    organizationSlug: string,
    fullName: string,
    email: string,
    password: string,
  ) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function restoreSession() {
      setLoading(true);
      setError(null);
      const storedToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);

      if (!storedToken) {
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await getMe(storedToken, controller.signal);
        if (!controller.signal.aborted) {
          setToken(storedToken);
          setUser(response.user);
        }
      } catch (restoreError) {
        if (controller.signal.aborted) {
          return;
        }

        if (restoreError instanceof ApiError && restoreError.status === 401) {
          window.localStorage.removeItem(ACCESS_TOKEN_KEY);
          setToken(null);
          setUser(null);
        } else {
          setError(
            restoreError instanceof Error
              ? restoreError.message
              : "Unable to restore your session.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void restoreSession();
    return () => controller.abort();
  }, [retryCount]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginApi(email, password);
    window.localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
    setToken(response.access_token);
    setUser(response.user);
    setError(null);
    return response.user;
  }, []);

  const register = useCallback(
    async (
      organizationName: string,
      organizationSlug: string,
      fullName: string,
      email: string,
      password: string,
    ) => {
      const response = await registerApi(
        organizationName,
        organizationSlug,
        fullName,
        email,
        password,
      );
      window.localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
      setToken(response.access_token);
      setUser(response.user);
      setError(null);
      return response.user;
    },
    [],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const retry = useCallback(() => {
    setRetryCount((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, error, retry, login, register, logout }),
    [user, token, loading, error, retry, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

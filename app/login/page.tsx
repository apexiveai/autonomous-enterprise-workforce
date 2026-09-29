"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {

  const router = useRouter();

  const {

    user,

    loading: authLoading,

    login,

  } = useAuth();

  const [email, setEmail] =

    useState("");

  const [password, setPassword] =

    useState("");

  const [loading, setLoading] =

    useState(false);

  const [error, setError] =

    useState("");

  useEffect(() => {

    if (!authLoading && user) {

      router.replace("/dashboard");

    }

  }, [

    authLoading,

    user,

    router,

  ]);

  async function handleSubmit(

    event: React.FormEvent<HTMLFormElement>

  ) {

    event.preventDefault();

    setError("");

    if (!email.trim()) {

      setError("Please enter your email.");

      return;

    }

    if (!password) {

      setError("Please enter your password.");

      return;

    }

    try {

      setLoading(true);

      await login(

        email,

        password

      );

      router.replace("/dashboard");

      router.refresh();

    } catch (err) {

      setError(

        err instanceof Error

          ? err.message

          : "Unable to sign in."

      );

    } finally {

      setLoading(false);

    }

  }

  if (authLoading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-white">

        <div className="text-sm text-gray-500">

          Loading...

        </div>

      </main>

    );

  }

  return (

    <main className="min-h-screen bg-white">

      <div className="flex min-h-screen">

        <section className="hidden w-1/2 bg-black p-12 text-white lg:flex lg:flex-col lg:justify-between">

          <div>

            <div className="text-2xl font-bold tracking-tight">

              APEXIVE AI

            </div>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">

              Autonomous Enterprise Intelligence

              & Execution Infrastructure

            </p>

          </div>

          <div>

            <div className="mb-6 h-px w-20 bg-gray-700" />

            <h1 className="max-w-xl text-5xl font-semibold leading-tight">

              From enterprise goals

              <br />

              to governed execution.

            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-400">

              Plan, execute, verify, recover and

              audit enterprise work with governed

              AI agents.

            </p>

          </div>

          <div className="text-xs text-gray-500">

            © 2026 Apexive AI

          </div>

        </section>

        <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">

          <div className="w-full max-w-md">

            <div className="mb-10">

              <div className="mb-2 text-sm font-semibold tracking-wider text-gray-500">

                APEXIVE AI

              </div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-950">

                Welcome back

              </h2>

              <p className="mt-2 text-sm text-gray-500">

                Sign in to your enterprise workspace.

              </p>

            </div>

            <form

              onSubmit={handleSubmit}

              className="space-y-5"

            >

              <div>

                <label

                  htmlFor="email"

                  className="mb-2 block text-sm font-medium text-gray-800"

                >

                  Email

                </label>

                <input

                  id="email"

                  type="email"

                  autoComplete="email"

                  value={email}

                  onChange={(event) =>

                    setEmail(

                      event.target.value

                    )

                  }

                  placeholder="you@company.com"
className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/5"

                />

              </div>

              <div>

                <label

                  htmlFor="password"

                  className="mb-2 block text-sm font-medium text-gray-800"

                >

                  Password

                </label>

                <input

                  id="password"

                  type="password"

                  autoComplete="current-password"

                  value={password}

                  onChange={(event) =>

                    setPassword(

                      event.target.value

                    )

                  }

                  placeholder="••••••••"

                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/5"

                />

              </div>

              {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                  {error}

                </div>

              )}

              <button

                type="submit"

                disabled={loading}

                className="w-full rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"

              >

                {loading

                  ? "Signing in..."

                  : "Sign in"}

              </button>

            </form>

            <div className="mt-8 text-center text-sm text-gray-500">

              Don&apos;t have an account?{" "}

              <Link

                href="/register"

                className="font-semibold text-black hover:underline"

              >

                Create an account

              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>

  );

}
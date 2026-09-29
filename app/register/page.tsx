"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";

export default function RegisterPage() {

  const router = useRouter();

  const {

    user,

    loading: authLoading,

    register,

  } = useAuth();

  const [

    organizationName,

    setOrganizationName,

  ] = useState("");

  const [

    organizationSlug,

    setOrganizationSlug,

  ] = useState("");

  const [fullName, setFullName] =

    useState("");

  const [email, setEmail] =

    useState("");

  const [password, setPassword] =

    useState("");

  const [

    confirmPassword,

    setConfirmPassword,

  ] = useState("");

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

  function handleOrganizationNameChange(

    value: string

  ) {

    setOrganizationName(value);

    if (!organizationSlug) {

      setOrganizationSlug(

        value

          .toLowerCase()

          .trim()

          .replace(/[^a-z0-9]+/g, "-")

          .replace(/^-+|-+$/g, "")

      );

    }

  }

  function handleSlugChange(

    value: string

  ) {

    setOrganizationSlug(

      value

        .toLowerCase()

        .replace(/[^a-z0-9-]/g, "-")

        .replace(/-+/g, "-")

    );

  }

  async function handleSubmit(

    event: React.FormEvent<HTMLFormElement>

  ) {

    event.preventDefault();

    setError("");

    if (!organizationName.trim()) {

      setError(

        "Organization name is required."

      );

      return;

    }

    if (!organizationSlug.trim()) {

      setError(

        "Organization slug is required."

      );

      return;

    }

    if (!fullName.trim()) {

      setError(

        "Full name is required."

      );

      return;

    }

    if (!email.trim()) {

      setError(

        "Email is required."

      );

      return;

    }

    if (password.length < 8) {

      setError(

        "Password must be at least 8 characters."

      );

      return;

    }

    if (password !== confirmPassword) {

      setError(

        "Passwords do not match."

      );

      return;

    }

    try {

      setLoading(true);

      await register(

        organizationName,

        organizationSlug,

        fullName,

        email,

        password

      );

      router.replace("/dashboard");

      router.refresh();

    } catch (err) {

      setError(

        err instanceof Error

          ? err.message

          : "Unable to create account."

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

    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">

        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-2">

          <section className="hidden bg-black p-12 text-white lg:flex lg:flex-col lg:justify-between">

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

              <p className="mb-4 text-sm font-medium text-gray-400">

                ENTERPRISE EXECUTION

              </p>

              <h1 className="text-4xl font-semibold leading-tight">

                Build your

                <br />
enterprise workspace.

              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-gray-400">

                Create an organization and start

                managing governed AI-powered

                enterprise workflows.

              </p>

            </div>

            <div className="text-xs text-gray-500">

              Secure workspace • RBAC • Audit

            </div>

          </section>

          <section className="p-8 sm:p-10 lg:p-12">

            <div className="mb-8">

              <div className="mb-2 text-sm font-semibold tracking-wider text-gray-500">

                APEXIVE AI

              </div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-950">

                Create your account

              </h2>

              <p className="mt-2 text-sm text-gray-500">

                Set up your enterprise workspace.

              </p>

            </div>

            <form

              onSubmit={handleSubmit}

              className="space-y-4"

            >

              <div>

                <label

                  htmlFor="organizationName"

                  className="mb-2 block text-sm font-medium text-gray-800"

                >

                  Organization Name

                </label>

                <input

                  id="organizationName"

                  type="text"

                  value={organizationName}

                  onChange={(event) =>

                    handleOrganizationNameChange(

                      event.target.value

                    )

                  }

                  placeholder="Apexive Technologies"

                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"

                />

              </div>

              <div>

                <label

                  htmlFor="organizationSlug"

                  className="mb-2 block text-sm font-medium text-gray-800"

                >

                  Organization Slug

                </label>

                <input

                  id="organizationSlug"

                  type="text"

                  value={organizationSlug}

                  onChange={(event) =>

                    handleSlugChange(

                      event.target.value

                    )

                  }

                  placeholder="apexive-technologies"

                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"

                />

                <p className="mt-1.5 text-xs text-gray-400">

                  Lowercase letters, numbers and

                  hyphens only.

                </p>

              </div>

              <div>

                <label

                  htmlFor="fullName"

                  className="mb-2 block text-sm font-medium text-gray-800"

                >

                  Full Name

                </label>

                <input

                  id="fullName"

                  type="text"

                  autoComplete="name"

                  value={fullName}

                  onChange={(event) =>

                    setFullName(

                      event.target.value

                    )

                  }

                  placeholder="Bhone Htet Naing"

                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"

                />

              </div>

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

                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"

                />

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

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

                    autoComplete="new-password"

                    value={password}

                    onChange={(event) =>

                      setPassword(

                        event.target.value

                      )

                    }

                    placeholder="8+ characters"

                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"

                  />

                </div>

                <div>

                  <label

                    htmlFor="confirmPassword"

                    className="mb-2 block text-sm font-medium text-gray-800"

                  >

                    Confirm Password

                  </label>

                  <input

                    id="confirmPassword"

                    type="password"

                    autoComplete="new-password"

                    value={confirmPassword}

                    onChange={(event) =>

                      setConfirmPassword(

                        event.target.value

                      )

                    }

                    placeholder="Repeat password"

                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"

                  />

                </div>

              </div>

              {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                  {error}

                </div>

              )}

              <button

                type="submit"

                disabled={loading}

                className="mt-2 w-full rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"

              >

                {loading

                  ? "Creating account..."

                  : "Create account"}

              </button>

            </form>

            <div className="mt-7 text-center text-sm text-gray-500">

              Already have an account?{" "}

              <Link

                href="/login"

                className="font-semibold text-black hover:underline"

              >

                Sign in

              </Link>

            </div>

          </section>

        </div>

      </div>

    </main>

  );

}
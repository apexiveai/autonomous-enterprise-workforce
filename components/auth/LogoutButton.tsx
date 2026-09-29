"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";

export default function LogoutButton() {

  const router = useRouter();

  const { logout } = useAuth();

  function handleLogout() {

    logout();

    router.replace("/login");

  }

  return (

    <button

      type="button"

      onClick={handleLogout}

      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"

    >

      Logout

    </button>

  );

}
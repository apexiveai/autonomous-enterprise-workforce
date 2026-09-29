"use client";

import { Menu } from "lucide-react";

import LogoutButton from "@/components/auth/LogoutButton";
import { useAuth } from "@/components/providers/AuthProvider";

export function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user } = useAuth();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:left-64">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">
            Autonomous Enterprise Workforce
          </div>
          <div className="hidden text-[11px] text-slate-400 sm:block">
            Agent Execution Control Plane
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        {user && (
          <div className="hidden text-right sm:block">
            <div className="text-xs font-medium text-slate-700">
              {user.full_name}
            </div>
            <div className="text-[10px] text-slate-400">{user.role}</div>
          </div>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}

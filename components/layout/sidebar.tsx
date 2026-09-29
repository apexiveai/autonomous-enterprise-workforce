"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bot,
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  MessagesSquare,
  ScrollText,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Executions", href: "/executions", icon: Activity },
  { name: "Approvals", href: "/approvals", icon: CheckCircle2 },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Audit Log", href: "/audit", icon: ScrollText },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Forums", href: "/forums", icon: MessagesSquare },
];

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
  onClose: () => void;
}

export function Sidebar({ isOpen, onNavigate, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:z-40 lg:w-64 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
              A
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-950">
                AEWE
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Enterprise Workforce
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 px-3 py-6">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Control Plane
          </div>
          <nav aria-label="Main navigation" className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] leading-5 text-slate-500">
              Runtime health is not reported by the current API.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS } from "@/lib/tools.config";
import { cn } from "@/components/ui/cn";
import { gaEvent } from "@/lib/ga";

interface NavbarProps {
  isPro?: boolean;
}

export function Navbar({ isPro = false }: NavbarProps) {
  const pathname = usePathname();
  const activeTools = TOOLS.filter((t) => t.active && t.phase === 1);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-semibold text-slate-900">
            APPNAME
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {activeTools.map((t) => {
              const isActive = pathname === t.path || pathname?.startsWith(t.path + "/");
              return (
                <Link
                  key={t.id}
                  href={t.path}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    isActive && "bg-slate-100 text-slate-900"
                  )}
                >
                  <span className="mr-1">{t.icon}</span>
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {!isPro && (
            <Link
              href="/upgrade"
              onClick={() => gaEvent("upgrade_click", { source: "navbar" })}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Upgrade
            </Link>
          )}
        </div>
        <nav className="flex w-full gap-2 overflow-x-auto pb-1 lg:hidden">
          {activeTools.map((t) => {
            const isActive = pathname === t.path || pathname?.startsWith(t.path + "/");
            return (
              <Link
                key={t.id}
                href={t.path}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  isActive && "bg-slate-100 text-slate-900"
                )}
              >
                <span className="mr-1">{t.icon}</span>
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}


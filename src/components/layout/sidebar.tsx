"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { appRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const expanded = mobile || sidebarOpen;

  return (
    <aside
      className={cn(
        "glass-panel sticky top-4 flex h-[calc(100vh-2rem)] flex-col rounded-[30px] p-4",
        mobile ? "w-full" : cn("hidden lg:flex", expanded ? "w-[268px]" : "w-[92px]")
      )}
    >
      <div className="mb-8 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-slate-950 shadow-glow">
            <Rocket className="h-5 w-5" />
          </div>
          {expanded ? (
            <div>
              <p className="font-display text-xl font-bold tracking-[0.08em] text-white">AstroShield</p>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Mission Control</p>
            </div>
          ) : null}
        </Link>
        <Button variant="ghost" size="sm" onClick={toggleSidebar} className={cn(!mobile && "hidden lg:inline-flex", mobile && "inline-flex")}>
          <ChevronLeft className={cn("h-4 w-4 transition", !expanded && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 space-y-2">
        {appRoutes.filter((route) => route.href !== "/login").map((route) => {
          const active =
            route.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(route.href);
          const Icon = route.icon;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 transition duration-300",
                active
                  ? "bg-cyan-300/12 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
                  : "hover:bg-white/5 hover:text-white hover:shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-cyan-400/12 via-sky-400/10 to-fuchsia-500/10"
                />
              ) : null}
              <span className={cn("absolute inset-y-2 left-1 w-1 rounded-full bg-cyan-300/70 transition", active ? "opacity-100" : "opacity-0 group-hover:opacity-70")} />
              <Icon className="relative h-4 w-4 shrink-0 transition group-hover:scale-110" />
              {expanded ? <span className="relative">{route.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-[24px] border border-cyan-300/10 bg-gradient-to-br from-cyan-400/10 to-fuchsia-500/10 p-4">
        {expanded ? (
          <>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">System State</p>
            <p className="mt-3 font-display text-2xl text-white">GREENLINE</p>
            <p className="mt-2 text-sm text-slate-300">Telemetry healthy across all mock data pipelines.</p>
          </>
        ) : (
          <div className="mx-auto h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.75)]" />
        )}
      </div>
    </aside>
  );
}

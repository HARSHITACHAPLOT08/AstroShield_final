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
        "glass-panel relative sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[30px] p-4",
        mobile ? "w-full" : cn("hidden lg:flex", expanded ? "w-[268px]" : "w-[92px]")
      )}
    >
      <div className={cn("mb-8 flex items-center", expanded ? "justify-between gap-3" : "justify-center")}>
        <Link href="/" className={cn("flex items-center", expanded ? "gap-3 overflow-hidden" : "justify-center")}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-slate-950 shadow-glow">
            <Rocket className="h-5 w-5" />
          </div>
          {expanded ? (
            <div>
              <p className="text-space-heading font-display text-xl font-bold tracking-[0.08em]">AstroShield</p>
              <p className="text-space-section text-xs uppercase tracking-[0.28em]">Mission Control</p>
            </div>
          ) : null}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            !mobile && "hidden lg:inline-flex",
            mobile && "inline-flex",
            !expanded && !mobile && "absolute right-2 top-5 z-20"
          )}
        >
          <ChevronLeft className={cn("h-4 w-4 transition", !expanded && "rotate-180")} />
        </Button>
      </div>

      <nav
        data-lenis-prevent
        data-lenis-prevent-wheel
        className={cn("scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto", expanded ? "pr-1" : "pr-0") }
      >
        {appRoutes.filter((route) => route.href !== "/login").map((route) => {
          const active =
            route.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(route.href);
          const Icon = route.icon;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group relative flex items-center overflow-hidden rounded-2xl py-3 text-sm font-semibold text-slate-300 transition duration-300",
                expanded ? "justify-start gap-3 px-4" : "justify-center px-0",
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
              {expanded ? (
                <span className={cn("absolute inset-y-2 left-1 w-1 rounded-full bg-cyan-300/70 transition", active ? "opacity-100" : "opacity-0 group-hover:opacity-70")} />
              ) : null}
              <Icon className="relative h-4 w-4 shrink-0 transition group-hover:scale-110" />
              {expanded ? <span className="relative">{route.label}</span> : null}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}

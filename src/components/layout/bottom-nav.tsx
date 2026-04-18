"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const primaryRoutes = appRoutes.filter((route) => route.href !== "/login");

  return (
    <div className="glass-panel fixed inset-x-4 bottom-4 z-40 overflow-x-auto rounded-[24px] p-2 lg:hidden">
      <div className="grid min-w-max grid-flow-col auto-cols-[minmax(92px,1fr)] gap-2">
      {primaryRoutes.map((route) => {
        const Icon = route.icon;
        const active =
          route.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            prefetch
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400",
              active && "bg-cyan-400/15 text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{route.label.split(" ")[0]}</span>
          </Link>
        );
      })}
      </div>
    </div>
  );
}

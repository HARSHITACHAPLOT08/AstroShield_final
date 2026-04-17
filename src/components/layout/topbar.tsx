"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { useAlertsData } from "@/hooks/use-platform-data";
import { cn } from "@/lib/utils";

function severityPill(severity: string) {
  switch (severity.toLowerCase()) {
    case "emergency":
      return "border-rose-200/70 bg-gradient-to-r from-rose-500/55 to-fuchsia-500/50 text-white shadow-[0_0_14px_rgba(244,63,94,0.45)]";
    case "alert":
      return "border-rose-200/65 bg-gradient-to-r from-rose-500/45 to-red-500/45 text-white shadow-[0_0_12px_rgba(239,68,68,0.38)]";
    case "warning":
      return "border-orange-300/45 bg-gradient-to-r from-orange-500/35 to-rose-500/25 text-orange-100";
    default:
      return "border-emerald-300/40 bg-emerald-500/16 text-emerald-100";
  }
}

function notificationTone(severity: string) {
  switch (severity.toLowerCase()) {
    case "emergency":
      return "border-rose-300/45 bg-gradient-to-br from-rose-600/32 via-red-600/24 to-fuchsia-700/20 shadow-[0_0_26px_rgba(225,29,72,0.22)] hover:border-rose-200/70";
    case "alert":
      return "border-red-300/38 bg-gradient-to-br from-red-600/26 via-rose-600/20 to-slate-950/75 shadow-[0_0_22px_rgba(220,38,38,0.2)] hover:border-red-200/65";
    case "warning":
      return "border-orange-300/32 bg-gradient-to-br from-orange-500/18 via-rose-600/12 to-slate-950/75 hover:border-orange-200/55";
    default:
      return "border-cyan-300/10 bg-slate-950/45 hover:border-cyan-300/30 hover:bg-slate-950/70";
  }
}

export function Topbar() {
  const { data: alerts } = useAlertsData();
  const [open, setOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const notifications = useMemo(() => {
    if (!alerts?.length) return [];

    return [...alerts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);
  }, [alerts]);

  const openCount = useMemo(
    () => notifications.filter((item) => item.status !== "resolved").length,
    [notifications]
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!notificationRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="glass-panel sticky top-4 z-30 flex items-center justify-between gap-4 rounded-[28px] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Sheet>
          <SheetTrigger className="glass-panel flex h-11 w-11 items-center justify-center rounded-2xl lg:hidden">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent className="lg:hidden">
            <Sidebar mobile />
          </SheetContent>
        </Sheet>
        <Link
          href="/"
          className="glass-panel flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2 lg:hidden"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-slate-950 shadow-glow">
            <span className="font-display text-sm">AS</span>
          </div>
          <div className="min-w-0">
            <p className="text-space-heading truncate font-display text-base tracking-[0.08em]">AstroShield</p>
            <p className="text-space-section truncate text-[10px] uppercase tracking-[0.28em]">Mission Control</p>
          </div>
        </Link>
        <div className="relative hidden min-w-[260px] md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input className="pl-11" placeholder="Search storms, assets, sectors..." />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge className="hidden border-emerald-300/20 bg-emerald-400/10 text-emerald-200 md:inline-flex">
          Live telemetry
        </Badge>
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            aria-label="Open notifications"
            aria-expanded={open}
            onClick={() => setOpen((state) => !state)}
            className="glass-panel relative flex h-11 w-11 items-center justify-center rounded-2xl transition hover:-translate-y-0.5 hover:border-cyan-300/30"
          >
            <Bell className="h-4 w-4 text-white" />
            {openCount > 0 ? (
              <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {openCount > 9 ? "9+" : openCount}
              </span>
            ) : null}
          </button>

          {open ? (
            <div className="glass-panel scrollbar-thin absolute right-0 top-14 z-50 w-[min(92vw,360px)] max-h-[70vh] overflow-y-auto rounded-3xl border border-cyan-300/15 p-3 shadow-[0_18px_60px_rgba(2,12,27,0.65)]">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-space-heading font-display text-lg">Notifications</p>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-space-section text-[11px] uppercase tracking-[0.22em] text-cyan-200 transition hover:text-cyan-100"
                >
                  View all
                </Link>
              </div>

              {notifications.length ? (
                <div className="space-y-2">
                  {notifications.map((item) => (
                    <Link
                      key={item.id}
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group block rounded-2xl border p-3 transition",
                        notificationTone(item.severity)
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]", severityPill(item.severity))}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-space-body mt-1 text-xs leading-relaxed">{item.summary}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-slate-300">
                        <span>{new Date(item.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                        <span>{item.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/40 p-4 text-center">
                  <p className="text-space-number text-sm text-slate-100">No notifications</p>
                  <p className="text-space-body mt-1 text-xs">All systems are currently quiet.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
        <Link
          href="/profile"
          className="group flex items-center gap-3 rounded-full border border-cyan-300/10 bg-slate-950/55 px-2 py-1.5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-slate-950/70"
        >
          <Avatar>
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
          <div className="hidden pr-2 md:block">
            <p className="text-space-number text-sm font-semibold">Aisha Rao</p>
            <p className="text-space-body text-xs uppercase tracking-[0.22em]">Mission Control Lead</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

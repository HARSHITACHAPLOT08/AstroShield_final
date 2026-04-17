"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";

export function Topbar() {
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
        <button className="glass-panel relative flex h-11 w-11 items-center justify-center rounded-2xl transition hover:-translate-y-0.5 hover:border-cyan-300/30">
          <Bell className="h-4 w-4 text-white" />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse rounded-full bg-rose-400" />
        </button>
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

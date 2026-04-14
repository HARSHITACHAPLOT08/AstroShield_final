"use client";

import { ShieldAlert } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { useUiStore } from "@/store/ui-store";
import type { UserRole } from "@/types";

export function RoleGuard({
  allowed,
  children
}: {
  allowed: UserRole[];
  children: React.ReactNode;
}) {
  const role = useUiStore((state) => state.role);

  if (allowed.includes(role)) {
    return <>{children}</>;
  }

  return (
    <GlassCard className="mx-auto max-w-xl text-center">
      <ShieldAlert className="mx-auto h-10 w-10 text-amber-300" />
      <h2 className="mt-4 font-display text-2xl text-white">Access Restricted</h2>
      <p className="mt-3 text-slate-300">
        Your current role is {role}. This area is reserved for {allowed.join(", ")} operators.
      </p>
    </GlassCard>
  );
}

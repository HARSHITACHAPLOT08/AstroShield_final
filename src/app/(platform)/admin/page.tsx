"use client";

import { motion } from "framer-motion";
import { Activity, Gauge, ShieldCheck, TerminalSquare } from "lucide-react";
import { RoleGuard } from "@/components/shared/role-guard";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionReveal } from "@/components/shared/section-reveal";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useAdminData } from "@/hooks/use-platform-data";
import { cn } from "@/lib/utils";

function statusTone(status: string) {
  const value = status.toLowerCase();
  if (value === "active" || value === "healthy") {
    return {
      dot: "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]",
      badge: "border-emerald-300/45 bg-emerald-500/18 text-emerald-100"
    };
  }

  if (value === "pending") {
    return {
      dot: "bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.9)]",
      badge: "border-amber-300/45 bg-amber-500/16 text-amber-100"
    };
  }

  return {
    dot: "bg-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.9)]",
    badge: "border-rose-300/45 bg-rose-500/18 text-rose-100"
  };
}

export default function AdminPage() {
  const { data } = useAdminData();

  const activeUsers = data?.users.filter((user) => user.status.toLowerCase() === "active").length ?? 0;
  const avgLatency = data?.apiHealth.length
    ? Math.round(data.apiHealth.reduce((sum, api) => sum + api.latency, 0) / data.apiHealth.length)
    : 0;
  const healthyApis = data?.apiHealth.filter((api) => api.status.toLowerCase() === "healthy").length ?? 0;
  const healthScore = data?.apiHealth.length ? Math.round((healthyApis / data.apiHealth.length) * 100) : 0;

  return (
    <RoleGuard allowed={["Admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Admin"
          title="Admin Control Panel"
          description="Manage users, telemetry health, security posture, refresh intervals, and core system configuration."
          badge="Admin role required"
        />

        <SectionReveal delay={0.05} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "User Availability",
              value: `${activeUsers}/${data?.users.length ?? 0}`,
              detail: "active operators",
              icon: ShieldCheck,
              color: "text-emerald-200"
            },
            {
              label: "API Health Score",
              value: `${healthScore}%`,
              detail: "service stability",
              icon: Activity,
              color: "text-cyan-200"
            },
            {
              label: "Avg Latency",
              value: `${avgLatency} ms`,
              detail: "telemetry response",
              icon: Gauge,
              color: "text-violet-200"
            },
            {
              label: "Log Throughput",
              value: `${data?.logs.length ?? 0} events`,
              detail: "current buffer",
              icon: TerminalSquare,
              color: "text-fuchsia-200"
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <GlassCard className="h-full border-cyan-300/15 bg-gradient-to-br from-[#041027]/80 via-[#050a1e]/80 to-[#07162a]/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-space-section text-[11px] uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                      <p className="text-space-heading mt-2 font-display text-2xl text-white">{stat.value}</p>
                      <p className="mt-1 text-xs text-slate-300">{stat.detail}</p>
                    </div>
                    <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-2">
                      <Icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </SectionReveal>

        <SectionReveal delay={0.1} className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <GlassCard className="bg-gradient-to-br from-[#040d24]/75 via-[#050a1d]/65 to-[#09253b]/40">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">User Management</p>
            <div className="mt-5 overflow-hidden rounded-[24px] border border-cyan-300/10">
              <Table>
                <thead className="bg-slate-950/50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </thead>
                <tbody>
                  {data?.users.map((user) => (
                    <TableRow key={user.email} className="transition hover:bg-cyan-500/6">
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em]", statusTone(user.status).badge)}>
                          <span className={cn("h-2 w-2 rounded-full", statusTone(user.status).dot)} />
                          {user.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-[#050a1e]/70 via-[#040a16]/70 to-[#0a1f33]/45">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">System Config</p>
            <div className="mt-6 space-y-4">
              <Select defaultValue="30s">
                <SelectTrigger>
                  <SelectValue placeholder="Refresh interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15s">15 seconds</SelectItem>
                  <SelectItem value="30s">30 seconds</SelectItem>
                  <SelectItem value="60s">60 seconds</SelectItem>
                </SelectContent>
              </Select>
              {[
                "Strict auth logging",
                "IP allowlist",
                "Webhook signing"
              ].map((setting, index) => (
                <motion.div
                  key={setting}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-slate-950/55 px-4 py-4 transition hover:border-cyan-300/25 hover:bg-slate-950/75"
                >
                  <span className="text-slate-100">{setting}</span>
                  <Switch defaultChecked={index !== 1} />
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </SectionReveal>

        <SectionReveal delay={0.14} className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="bg-gradient-to-br from-[#050d23]/75 via-[#040a18]/65 to-[#07253b]/35">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">API Health Monitors</p>
            <div className="mt-6 space-y-4">
              {data?.apiHealth.map((api) => (
                <motion.div
                  key={api.name}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4 transition hover:border-cyan-300/30"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{api.name}</p>
                    <Badge className={cn("border", statusTone(api.status).badge)}>{api.status}</Badge>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, Math.max(8, 100 - api.latency / 6))}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        api.status.toLowerCase() === "healthy"
                          ? "bg-gradient-to-r from-emerald-400 to-cyan-300"
                          : "bg-gradient-to-r from-amber-400 to-rose-400"
                      )}
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{api.latency} ms latency</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-[#050a1c]/75 via-[#040a16]/65 to-[#091d34]/30">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Logs Viewer</p>
            <div className="scrollbar-thin mt-6 max-h-[330px] space-y-3 overflow-y-auto pr-1">
              {data?.logs.map((log, index) => (
                <motion.div
                  key={log}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.32, delay: index * 0.04 }}
                  className="rounded-2xl border border-cyan-300/10 bg-slate-950/65 p-4 font-mono text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-slate-950/85"
                >
                  {log}
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </SectionReveal>
      </div>
    </RoleGuard>
  );
}

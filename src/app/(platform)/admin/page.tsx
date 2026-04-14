"use client";

import { RoleGuard } from "@/components/shared/role-guard";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useAdminData } from "@/hooks/use-platform-data";

export default function AdminPage() {
  const { data } = useAdminData();

  return (
    <RoleGuard allowed={["Admin"]}>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Admin"
          title="Admin Control Panel"
          description="Manage users, telemetry health, security posture, refresh intervals, and core system configuration."
          badge="Admin role required"
        />

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <GlassCard>
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
                    <TableRow key={user.email}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </div>
          </GlassCard>

          <GlassCard>
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
              {["Strict auth logging", "IP allowlist", "Webhook signing"].map((setting, index) => (
                <div key={setting} className="flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-slate-950/55 px-4 py-4">
                  <span className="text-slate-100">{setting}</span>
                  <Switch defaultChecked={index !== 1} />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassCard>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">API Health Monitors</p>
            <div className="mt-6 space-y-4">
              {data?.apiHealth.map((api) => (
                <div key={api.name} className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{api.name}</p>
                    <span className="text-sm text-slate-400">{api.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{api.latency} ms latency</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Logs Viewer</p>
            <div className="mt-6 space-y-4">
              {data?.logs.map((log) => (
                <div key={log} className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4 font-mono text-sm text-slate-200">
                  {log}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </RoleGuard>
  );
}

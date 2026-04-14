"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useProfileData } from "@/hooks/use-platform-data";
import { useUiStore } from "@/store/ui-store";

export default function ProfilePage() {
  const { data } = useProfileData();
  const { role, setRole } = useUiStore();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Operator Settings"
        description="Tune mission preferences, alert channels, and role-scoped experience settings for your AstroShield workspace."
        badge={role}
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Identity</p>
          <h2 className="mt-3 font-display text-4xl text-white">{data?.name}</h2>
          <p className="mt-3 text-slate-300">{data?.title}</p>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>{data?.organization}</p>
            <p>{data?.email}</p>
            <p>{data?.timezone}</p>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Role Selector</p>
            <div className="mt-6 max-w-xs">
              <Select value={role} onValueChange={(value) => setRole(value as typeof role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Notification Channels</p>
            <div className="mt-6 space-y-4">
              {data?.channels.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-slate-950/55 px-4 py-4">
                  <span className="text-slate-100">{channel.name}</span>
                  <Switch defaultChecked={channel.enabled} />
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Mission Preferences</p>
            <div className="mt-6 space-y-3">
              {data?.preferences.map((preference) => (
                <div key={preference} className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4 text-slate-100">
                  {preference}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

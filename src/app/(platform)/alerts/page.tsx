"use client";

import { AlertFeed } from "@/components/shared/alert-feed";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAlertsData } from "@/hooks/use-platform-data";

export default function AlertsPage() {
  const { data } = useAlertsData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Alerts"
        title="Alert Management Center"
        description="Control threshold-based alerting, response checklists, and live notification routing across mission teams."
        badge="Severity ladder active"
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {data ? <AlertFeed alerts={data} /> : null}

        <div className="space-y-6">
          <GlassCard>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Severity System</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                ["Watch", "Green"],
                ["Warning", "Yellow"],
                ["Alert", "Red"],
                ["Emergency", "Purple"]
              ].map(([level, tone]) => (
                <div key={level} className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4">
                  <p className="font-semibold text-white">{level}</p>
                  <p className="mt-2 text-sm text-slate-400">{tone} escalation tier</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Threshold Settings</p>
            <div className="mt-6 space-y-6">
              <div>
                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-slate-200">Kp alert threshold</span>
                  <span className="text-slate-400">6.0</span>
                </div>
                <Slider defaultValue={[60]} max={100} />
              </div>
              <div>
                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-slate-200">Bz southward threshold</span>
                  <span className="text-slate-400">-12 nT</span>
                </div>
                <Slider defaultValue={[72]} max={100} />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Notification Channels</p>
            <div className="mt-6 space-y-4">
              {["Email", "SMS", "Slack", "Webhook"].map((channel, index) => (
                <div key={channel} className="flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-slate-950/55 px-4 py-4">
                  <span className="text-slate-100">{channel}</span>
                  <Switch defaultChecked={index < 2} />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

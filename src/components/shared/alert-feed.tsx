import { BellRing } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { severityToTone } from "@/lib/utils";
import type { AlertItem } from "@/types";

export function AlertFeed({ alerts }: { alerts: AlertItem[] }) {
  return (
    <GlassCard className="h-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Live Alerts</p>
          <h3 className="mt-2 font-display text-2xl text-white">Response Queue</h3>
        </div>
        <BellRing className="h-5 w-5 text-cyan-300" />
      </div>
      <div className="scrollbar-thin max-h-[380px] space-y-3 overflow-auto pr-2">
        {alerts.map((alert) => (
          <div key={alert.id} className={`rounded-2xl border bg-gradient-to-br p-4 ${severityToTone(alert.severity)}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-white">{alert.title}</h4>
                <p className="mt-2 text-sm text-slate-300">{alert.summary}</p>
              </div>
              <Badge>{alert.severity}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
              <span>{new Date(alert.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
              <span>{alert.target}</span>
              <span>{alert.status}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

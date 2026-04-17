import { motion } from "framer-motion";
import { BellRing } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn, severityToTone } from "@/lib/utils";
import type { AlertItem } from "@/types";

function severityGlow(severity: string) {
  switch (severity.toLowerCase()) {
    case "emergency":
    case "critical":
      return {
        badge: "border-fuchsia-300/40 bg-fuchsia-500/18 text-fuchsia-100",
        shadow: "hover:shadow-[0_0_36px_rgba(217,70,239,0.30)]"
      };
    case "alert":
    case "high":
      return {
        badge: "border-rose-300/40 bg-rose-500/18 text-rose-100",
        shadow: "hover:shadow-[0_0_34px_rgba(244,63,94,0.28)]"
      };
    case "warning":
    case "moderate":
      return {
        badge: "border-amber-300/40 bg-amber-500/16 text-amber-100",
        shadow: "hover:shadow-[0_0_30px_rgba(251,191,36,0.24)]"
      };
    default:
      return {
        badge: "border-emerald-300/40 bg-emerald-500/16 text-emerald-100",
        shadow: "hover:shadow-[0_0_28px_rgba(52,211,153,0.22)]"
      };
  }
}

function isHighPrioritySeverity(severity: string) {
  const normalized = severity.toLowerCase();
  return normalized === "alert" || normalized === "emergency" || normalized === "critical";
}

export function AlertFeed({ alerts }: { alerts: AlertItem[] }) {
  return (
    <GlassCard className="h-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-space-section text-sm uppercase tracking-[0.24em]">Live Alerts</p>
          <h3 className="text-space-heading mt-2 font-display text-2xl">Response Queue</h3>
        </div>
        <BellRing className="h-5 w-5 text-cyan-300" />
      </div>
      <div className="scrollbar-thin max-h-[380px] space-y-3 overflow-auto pr-2">
        {alerts.map((alert, index) => {
          const tone = severityGlow(alert.severity);
          const isHighPriority = isHighPrioritySeverity(alert.severity);

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300",
                severityToTone(alert.severity),
                tone.shadow,
                "hover:border-cyan-300/50"
              )}
            >
              {isHighPriority ? (
                <>
                  <motion.span
                    className="pointer-events-none absolute left-3 top-3 h-3 w-3 rounded-full bg-rose-300"
                    animate={{ scale: [1, 1.45, 1], opacity: [0.9, 0.35, 0.9] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="pointer-events-none absolute left-[9px] top-[9px] h-[15px] w-[15px] rounded-full border border-rose-200/80"
                    animate={{ scale: [1, 2.2], opacity: [0.65, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                  />
                </>
              ) : null}

              <div className="pointer-events-none absolute -right-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-cyan-300/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-80" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className={cn("font-semibold text-white", isHighPriority ? "text-space-alert pl-5" : "")}>{alert.title}</h4>
                  <p className="text-space-body mt-2 text-sm">{alert.summary}</p>
                </div>
                <Badge className={cn("tracking-[0.18em]", tone.badge)}>{alert.severity}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-slate-300">
                <span>{new Date(alert.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                <span>{alert.target}</span>
                <span>{alert.status}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

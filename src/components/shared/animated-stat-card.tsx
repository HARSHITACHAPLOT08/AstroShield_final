"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import type { Metric } from "@/types";

const tones: Record<Metric["severity"], string> = {
  low: "from-emerald-400/12 to-cyan-400/10 border-emerald-300/20",
  moderate: "from-amber-400/12 to-orange-400/10 border-amber-300/20",
  high: "from-cyan-400/14 to-blue-500/10 border-cyan-300/25",
  critical: "from-fuchsia-500/14 to-rose-500/10 border-fuchsia-300/25"
};

export function AnimatedStatCard({ metric, delay = 0 }: { metric: Metric; delay?: number }) {
  const chartData = metric.sparkline.map((value, index) => ({ value, index }));
  const gradientId = `fill-${metric.label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -4 }}
    >
      <GlassCard className={`h-full border bg-gradient-to-br ${tones[metric.severity]}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{metric.label}</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-3xl font-bold text-white">{metric.value}</span>
              <span className="pb-1 text-sm text-slate-400">{metric.unit}</span>
            </div>
          </div>
          <Badge className="border-white/10 bg-white/5 text-white">{metric.change > 0 ? "+" : ""}{metric.change}%</Badge>
        </div>
        <div className="mt-5 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#7dd3fc" strokeWidth={2} fill={`url(#${gradientId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}

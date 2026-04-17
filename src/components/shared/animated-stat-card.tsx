"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import type { Metric } from "@/types";

const neonAccents = [
  {
    card: "from-fuchsia-500/24 via-rose-500/14 to-slate-950/75 border-fuchsia-300/36",
    glow: "from-fuchsia-300/55 via-rose-300/34 to-transparent",
    stroke: "#f9a8d4",
    fillStart: "#f472b6",
    fillMid: "#fb7185",
    chip: "border-fuchsia-100/28 bg-fuchsia-300/12 text-fuchsia-50",
    iconGlow: "shadow-[0_0_34px_rgba(244,114,182,0.32)]"
  },
  {
    card: "from-amber-300/26 via-yellow-400/14 to-slate-950/75 border-amber-200/38",
    glow: "from-yellow-300/58 via-amber-300/34 to-transparent",
    stroke: "#fde047",
    fillStart: "#facc15",
    fillMid: "#fb923c",
    chip: "border-amber-100/28 bg-amber-300/12 text-amber-50",
    iconGlow: "shadow-[0_0_34px_rgba(250,204,21,0.28)]"
  },
  {
    card: "from-rose-500/24 via-red-500/14 to-slate-950/75 border-rose-300/36",
    glow: "from-rose-300/56 via-red-300/34 to-transparent",
    stroke: "#fb7185",
    fillStart: "#f43f5e",
    fillMid: "#fb7185",
    chip: "border-rose-100/28 bg-rose-300/12 text-rose-50",
    iconGlow: "shadow-[0_0_34px_rgba(251,113,133,0.32)]"
  },
  {
    card: "from-cyan-400/24 via-sky-500/14 to-slate-950/75 border-cyan-300/36",
    glow: "from-cyan-300/55 via-sky-300/32 to-transparent",
    stroke: "#67e8f9",
    fillStart: "#22d3ee",
    fillMid: "#38bdf8",
    chip: "border-cyan-100/28 bg-cyan-300/12 text-cyan-50",
    iconGlow: "shadow-[0_0_34px_rgba(34,211,238,0.3)]"
  },
  {
    card: "from-violet-500/24 via-purple-500/14 to-slate-950/75 border-violet-300/36",
    glow: "from-violet-300/56 via-purple-300/34 to-transparent",
    stroke: "#c4b5fd",
    fillStart: "#a78bfa",
    fillMid: "#c084fc",
    chip: "border-violet-100/28 bg-violet-300/12 text-violet-50",
    iconGlow: "shadow-[0_0_34px_rgba(167,139,250,0.3)]"
  },
  {
    card: "from-lime-400/24 via-emerald-500/14 to-slate-950/75 border-lime-300/36",
    glow: "from-lime-300/56 via-emerald-300/34 to-transparent",
    stroke: "#bef264",
    fillStart: "#a3e635",
    fillMid: "#34d399",
    chip: "border-lime-100/28 bg-lime-300/12 text-lime-50",
    iconGlow: "shadow-[0_0_34px_rgba(163,230,53,0.28)]"
  }
] as const;

const tones: Record<
  Metric["severity"],
  {
    card: string;
    chip: string;
    glow: string;
    stroke: string;
    fillStart: string;
    fillMid: string;
  }
> = {
  low: {
    card: "from-emerald-400/18 via-cyan-500/10 to-slate-950/70 border-emerald-300/30",
    chip: "border-emerald-200/25 bg-emerald-300/12 text-emerald-100",
    glow: "from-emerald-300/45 via-cyan-300/30 to-transparent",
    stroke: "#6ee7b7",
    fillStart: "#34d399",
    fillMid: "#22d3ee"
  },
  moderate: {
    card: "from-amber-300/22 via-orange-500/12 to-slate-950/70 border-amber-300/34",
    chip: "border-amber-100/25 bg-amber-300/12 text-amber-50",
    glow: "from-amber-300/45 via-orange-300/28 to-transparent",
    stroke: "#fbbf24",
    fillStart: "#f59e0b",
    fillMid: "#fb923c"
  },
  high: {
    card: "from-cyan-400/20 via-blue-500/14 to-slate-950/72 border-cyan-300/36",
    chip: "border-cyan-100/24 bg-cyan-300/10 text-cyan-50",
    glow: "from-cyan-300/48 via-blue-300/30 to-transparent",
    stroke: "#67e8f9",
    fillStart: "#22d3ee",
    fillMid: "#38bdf8"
  },
  critical: {
    card: "from-fuchsia-500/24 via-rose-500/16 to-slate-950/75 border-fuchsia-300/38",
    chip: "border-fuchsia-100/24 bg-fuchsia-300/12 text-fuchsia-50",
    glow: "from-fuchsia-300/50 via-rose-300/30 to-transparent",
    stroke: "#f9a8d4",
    fillStart: "#e879f9",
    fillMid: "#fb7185"
  }
};

export function AnimatedStatCard({ metric, delay = 0 }: { metric: Metric; delay?: number }) {
  const chartData = metric.sparkline.map((value, index) => ({ value, index }));
  const gradientId = `fill-${metric.label.replace(/\s+/g, "-").toLowerCase()}`;
  const tone = tones[metric.severity];
  const neonTone = neonAccents[Math.abs(metric.label.length) % neonAccents.length];
  const isPositive = metric.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -8, scale: 1.016 }}
    >
      <GlassCard
        className={`h-full border bg-gradient-to-br shadow-[0_0_0_1px_rgba(125,211,252,0.06),0_16px_40px_rgba(2,6,23,0.42)] transition hover:shadow-[0_0_46px_rgba(255,255,255,0.14)] ${tone.card} ${neonTone.card}`}
      >
        <div className={`pointer-events-none absolute -right-14 top-0 h-32 w-32 rounded-full blur-3xl bg-gradient-to-br ${neonTone.glow}`} />
        <div className={`pointer-events-none absolute -left-8 bottom-2 h-24 w-24 rounded-full blur-3xl bg-gradient-to-br ${neonTone.glow} opacity-65`} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] bg-[length:260%_100%] opacity-35" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-white/85">{metric.label}</p>
            <div className="mt-3 flex items-end gap-2">
              <span className={`font-display text-3xl font-bold text-white ${neonTone.iconGlow}`}>{metric.value}</span>
              <span className="pb-1 text-sm text-slate-100/80">{metric.unit}</span>
            </div>
          </div>
          <Badge className={`${tone.chip} ${neonTone.chip} shadow-[0_0_20px_rgba(255,255,255,0.12)]`}>
            {isPositive ? "+" : ""}
            {metric.change}%
          </Badge>
        </div>
        <div className="mt-5 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={neonTone.fillStart} stopOpacity={0.85} />
                  <stop offset="60%" stopColor={neonTone.fillMid} stopOpacity={0.32} />
                  <stop offset="95%" stopColor={neonTone.fillMid} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={neonTone.stroke} strokeWidth={2.4} fill={`url(#${gradientId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}

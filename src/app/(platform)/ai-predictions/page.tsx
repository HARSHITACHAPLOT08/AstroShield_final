"use client";

import { motion } from "framer-motion";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { PredictionChart } from "@/components/shared/prediction-chart";
import { ContributionBars } from "@/components/visuals/contribution-bars";
import { HeatmapMatrix } from "@/components/visuals/heatmap-matrix";
import { usePredictionData } from "@/hooks/use-platform-data";
import { cn } from "@/lib/utils";

export default function PredictionsPage() {
  const { data } = usePredictionData();

  return (
    <div className="relative isolate space-y-6">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 28% 24%, rgba(34,211,238,0.12), transparent 32%), radial-gradient(circle at 72% 18%, rgba(168,85,247,0.11), transparent 34%), radial-gradient(circle at 48% 64%, rgba(59,130,246,0.08), transparent 36%)"
        }}
        animate={{
          backgroundPosition: ["0% 0%", "2% 3%", "0% 0%"]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background:radial-gradient(rgba(125,211,252,0.6)_1px,transparent_1.5px)] [background-size:32px_32px]"
        animate={{
          opacity: [0.18, 0.32, 0.18],
          backgroundPosition: ["0px 0px", "20px 12px", "0px 0px"]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[12%] top-[10%] -z-10 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl"
        animate={{ y: [0, -16, 0], x: [0, 10, 0], opacity: [0.35, 0.68, 0.35] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[6%] bottom-[20%] -z-10 h-56 w-56 rounded-full bg-purple-400/9 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, -12, 0], opacity: [0.28, 0.58, 0.28] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <PageHeader
        eyebrow="Prediction Engine"
        title="AI Storm Prediction Engine"
        description="Forecast geomagnetic storm risk across 24h, 48h, and 72h windows with explainability and performance transparency."
        badge="Ensemble confidence upgraded"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {data?.forecast.map((item) => (
          <PredictionChart key={item.window} title={item.window} probability={item.probability} confidence={item.confidence} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassCard className="group relative overflow-hidden border-cyan-300/20 bg-gradient-to-br from-[#041027]/90 via-[#050a20]/85 to-[#0a1a30]/80 transition duration-500 hover:border-cyan-200/35 hover:shadow-[0_20px_50px_rgba(34,211,238,0.16)]">
          <div className="pointer-events-none absolute -right-12 top-8 h-32 w-32 rounded-full bg-cyan-300/15 blur-2xl transition duration-700 group-hover:scale-110" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 [background:linear-gradient(135deg,rgba(34,211,238,0.06),transparent_48%,rgba(168,85,247,0.06))]" />
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Flare Prediction</p>
          <div className="mt-6 space-y-5">
            {data?.flareClass.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ x: 2, scale: 1.01 }}
                className="transition"
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{item.name}</span>
                  <span className="text-slate-400">{item.value}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-900/80">
                  <motion.div
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {data?.performance.map((metric) => (
              <motion.div
                key={metric.label}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-cyan-300/10 bg-slate-950/50 p-4 transition hover:border-cyan-200/25 hover:bg-slate-950/70"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                <p className="mt-2 font-display text-3xl text-white">{metric.value}%</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {data ? <ContributionBars data={data.drivers} /> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {data ? <HeatmapMatrix matrix={data.confusionMatrix} /> : null}

        <GlassCard className="group relative overflow-hidden border-purple-300/20 bg-gradient-to-br from-[#0a0f25]/90 via-[#0d0a1f]/85 to-[#120a2e]/80 transition duration-500 hover:border-purple-200/35 hover:shadow-[0_20px_50px_rgba(168,85,247,0.14)]">
          <div className="pointer-events-none absolute -left-16 -top-8 h-40 w-40 rounded-full bg-purple-400/12 blur-2xl transition duration-700 group-hover:scale-115" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_top_left,rgba(168,85,247,0.06),transparent_44%)]" />
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Prediction History</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.history}>
                <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Line type="monotone" dataKey="predicted" stroke="#22d3ee" strokeWidth={2.4} strokeOpacity={0.9} />
                <Line type="monotone" dataKey="observed" stroke="#f472b6" strokeWidth={2.4} strokeOpacity={0.9} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

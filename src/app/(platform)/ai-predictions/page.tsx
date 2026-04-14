"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { PredictionChart } from "@/components/shared/prediction-chart";
import { ContributionBars } from "@/components/visuals/contribution-bars";
import { HeatmapMatrix } from "@/components/visuals/heatmap-matrix";
import { usePredictionData } from "@/hooks/use-platform-data";

export default function PredictionsPage() {
  const { data } = usePredictionData();

  return (
    <div className="space-y-6">
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
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Flare Prediction</p>
          <div className="mt-6 space-y-5">
            {data?.flareClass.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{item.name}</span>
                  <span className="text-slate-400">{item.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-900/80">
                  <div className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {data?.performance.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-cyan-300/10 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                <p className="mt-2 font-display text-3xl text-white">{metric.value}%</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {data ? <ContributionBars data={data.drivers} /> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {data ? <HeatmapMatrix matrix={data.confusionMatrix} /> : null}

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Prediction History</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.history}>
                <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Line type="monotone" dataKey="predicted" stroke="#22d3ee" strokeWidth={2.4} />
                <Line type="monotone" dataKey="observed" stroke="#f472b6" strokeWidth={2.4} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

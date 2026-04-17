"use client";

import { ResponsiveContainer } from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { RechartsGlowBar } from "@/components/charts/recharts-glow-bar";
import { RechartsGlowArea } from "@/components/charts/recharts-glow-area";
import { RechartsGlowRadar } from "@/components/charts/recharts-glow-radar";
import { useAnalyticsData } from "@/hooks/use-platform-data";

export default function AnalyticsPage() {
  const { data } = useAnalyticsData();
  const radarData = (data?.cycleTrend ?? []).map((item) => ({
    subject: item.phase,
    storms: item.storms,
    sunspots: item.sunspots / 5
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Analytics and Reports"
        description="Search historical storm records, compare solar cycle trends, and generate executive-ready infrastructure impact reports."
        badge="Custom report builder"
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
        <Input placeholder="Search storm date, sector, severity..." />
        <button className="rounded-2xl border border-cyan-300/15 bg-slate-950/55 px-4 py-3 text-sm font-semibold text-slate-200">Filter by region</button>
        <button className="rounded-2xl border border-cyan-300/15 bg-slate-950/55 px-4 py-3 text-sm font-semibold text-slate-200">Download report</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RechartsGlowBar
          title="Storm History Database"
          description="Geomagnetic storm severity records (G-scale impact)"
          data={data?.stormHistory ?? []}
          dataKey="gScale"
          dateKey="date"
          color="#22d3ee"
          height={300}
        />

        <RechartsGlowArea
          title="Economic Impact Trend"
          description="Estimated infrastructure risk exposure by storm date"
          data={data?.stormHistory ?? []}
          dataKey="impact"
          dateKey="date"
          color="#f472b6"
          height={300}
          areaType="monotone"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <RechartsGlowRadar
          title="Solar Cycle Trends"
          description="Historical storms vs. sunspot activity normalized across solar phases"
          data={radarData}
          datasets={[
            { key: "storms", stroke: "#22d3ee", fill: "#22d3ee55" },
            { key: "sunspots", stroke: "#f472b6", fill: "#f472b655" }
          ]}
          height={320}
        />

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Custom Report Builder</p>
          <div className="mt-6 space-y-4">
            {data?.reports.map((report) => (
              <div key={report} className="flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4">
                <span className="text-slate-100">{report}</span>
                <button className="rounded-full bg-cyan-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                  Build
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

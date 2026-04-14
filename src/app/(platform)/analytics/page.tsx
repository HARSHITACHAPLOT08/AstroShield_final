"use client";

import { Area, AreaChart, Bar, BarChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { useAnalyticsData } from "@/hooks/use-platform-data";

export default function AnalyticsPage() {
  const { data } = useAnalyticsData();
  const radarData = data?.cycleTrend.map((item) => ({ subject: item.phase, storms: item.storms, sunspots: item.sunspots / 5 }));

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
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Storm History Database</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.stormHistory}>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Bar dataKey="gScale" fill="#22d3ee" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Economic Impact Trend</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.stormHistory}>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Area type="monotone" dataKey="impact" stroke="#f472b6" fill="#f472b633" strokeWidth={2.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Solar Cycle Trends</p>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(148,163,184,0.16)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                <Radar dataKey="storms" stroke="#22d3ee" fill="#22d3ee55" />
                <Radar dataKey="sunspots" stroke="#f472b6" fill="#f472b655" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

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

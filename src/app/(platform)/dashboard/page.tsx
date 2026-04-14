"use client";

import { Activity, Shield, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RiskMap } from "@/components/maps/risk-map";
import { AlertFeed } from "@/components/shared/alert-feed";
import { AnimatedStatCard } from "@/components/shared/animated-stat-card";
import { GeomagneticMeter } from "@/components/shared/geomagnetic-meter";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { useAlertsData, useDashboardData, useGridRiskData } from "@/hooks/use-platform-data";

export default function DashboardPage() {
  const { data, loading } = useDashboardData();
  const { data: alerts } = useAlertsData();
  const { data: gridRisk } = useGridRiskData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Space Weather Command Overview"
        description="Monitor the live operational posture across solar conditions, infrastructure exposure, and mission response."
        badge="G3 geomagnetic conditions"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading || !data
          ? Array.from({ length: 6 }).map((_, index) => <LoadingSkeleton key={index} className="h-[180px]" />)
          : data.stats.map((metric, index) => <AnimatedStatCard key={metric.label} metric={metric} delay={index * 0.05} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Solar Activity</p>
              <h2 className="mt-2 font-display text-3xl text-white">Solar wind, Bz, and Kp timeline</h2>
            </div>
            <Activity className="h-6 w-6 text-cyan-300" />
          </div>
          {data ? (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.solarActivity}>
                  <defs>
                    <linearGradient id="windFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(34,211,238,0.2)" }} />
                  <Area type="monotone" dataKey="wind" stroke="#22d3ee" fill="url(#windFill)" strokeWidth={2.4} />
                  <Area type="monotone" dataKey="kp" stroke="#f472b6" fill="transparent" strokeWidth={2.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <LoadingSkeleton className="h-[320px]" />
          )}
        </GlassCard>

        {alerts ? <AlertFeed alerts={alerts} /> : <LoadingSkeleton className="h-[420px]" />}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr_0.9fr]">
        <GlassCard className="overflow-hidden">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Grid Risk Preview</p>
              <h2 className="mt-2 font-display text-3xl text-white">Auroral exposure map</h2>
            </div>
            <Shield className="h-6 w-6 text-cyan-300" />
          </div>
          {gridRisk ? <RiskMap locations={gridRisk} /> : <LoadingSkeleton className="h-[420px]" />}
        </GlassCard>

        {data ? <GeomagneticMeter items={data.geomagneticScale} /> : <LoadingSkeleton className="h-[360px]" />}

        <GlassCard className="h-full">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Event Timeline</p>
              <h2 className="mt-2 font-display text-3xl text-white">Operational milestones</h2>
            </div>
            <Zap className="h-6 w-6 text-cyan-300" />
          </div>
          <div className="space-y-4">
            {data?.timeline.map((item) => (
              <div key={item.time} className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">{item.time}</p>
                <h3 className="mt-2 font-semibold text-white">{item.event}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.impact}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

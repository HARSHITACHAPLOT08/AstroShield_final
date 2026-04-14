"use client";

import { LineSignalChart } from "@/components/charts/line-signal-chart";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { OrbitMap } from "@/components/visuals/orbit-map";
import { useSatelliteData } from "@/hooks/use-platform-data";

export default function SatellitesPage() {
  const { data } = useSatelliteData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Satellite Monitor"
        title="Satellite Risk Monitor"
        description="Track exposure across LEO, MEO, and GEO assets with radiation and atmospheric drag indicators."
        badge="4 assets in view"
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {data ? <OrbitMap assets={data.assets} /> : null}
        {data ? (
          <LineSignalChart
            title="Radiation and Drag Exposure"
            labels={data.exposure.map((item) => item.time)}
            datasets={[
              { label: "Radiation", data: data.exposure.map((item) => item.radiation), color: "#f472b6" },
              { label: "Drag", data: data.exposure.map((item) => item.drag), color: "#22d3ee" }
            ]}
          />
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {data?.assets.map((asset) => (
            <GlassCard key={asset.id} className="bg-gradient-to-br from-cyan-400/10 via-slate-950/40 to-blue-500/10">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{asset.operator}</p>
              <h2 className="mt-2 font-display text-3xl text-white">{asset.name}</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-slate-950/80 to-cyan-500/5 p-4 transition hover:border-cyan-300/25">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Orbit</p>
                  <p className="mt-2 text-xl font-semibold text-white">{asset.orbit}</p>
                </div>
                <div className="rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-slate-950/80 to-fuchsia-500/5 p-4 transition hover:border-cyan-300/25">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Risk</p>
                  <p className="mt-2 text-xl font-semibold text-white">{asset.risk}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">Radiation {asset.radiation}% | Atmospheric drag {asset.drag}%</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Impacted Satellite Alerts</p>
          <div className="mt-6 space-y-4">
            {data?.alerts.map((alert) => (
              <div key={alert} className="rounded-2xl border border-fuchsia-300/15 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/5 p-4 text-slate-100 transition hover:border-fuchsia-300/30">
                {alert}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

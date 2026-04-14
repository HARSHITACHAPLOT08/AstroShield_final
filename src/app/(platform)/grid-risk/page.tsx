"use client";

import { useMemo, useState } from "react";
import { RiskMap } from "@/components/maps/risk-map";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { Slider } from "@/components/ui/slider";
import { useGridRiskData } from "@/hooks/use-platform-data";
import { formatCompact } from "@/lib/utils";

export default function GridRiskPage() {
  const { data } = useGridRiskData();
  const [severity, setSeverity] = useState([72]);

  const factor = useMemo(() => severity[0] / 72, [severity]);
  const selected = data?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Grid Risk"
        title="Grid Vulnerability and Risk Map"
        description="Explore infrastructure exposure by latitude, transformer concentration, modeled storm severity, and estimated economic consequence."
        badge="Interactive simulator"
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">World Risk Surface</p>
              <h2 className="mt-2 font-display text-3xl text-white">Severity-aware heat overlay</h2>
            </div>
            <p className="text-sm text-slate-400">Storm multiplier {factor.toFixed(2)}x</p>
          </div>
          {data ? <RiskMap locations={data} severityFactor={factor} /> : null}
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">GIC Simulator</p>
            <h2 className="mt-2 font-display text-3xl text-white">Adjust storm severity</h2>
            <p className="mt-3 text-slate-300">
              Shift the modeled geomagnetic intensity to estimate how risk zones expand in high-latitude infrastructure.
            </p>
            <div className="mt-8">
              <Slider value={severity} min={40} max={100} step={1} onValueChange={setSeverity} />
              <div className="mt-3 flex justify-between text-sm text-slate-400">
                <span>Moderate</span>
                <span>{severity[0]} / 100</span>
                <span>Extreme</span>
              </div>
            </div>
          </GlassCard>

          {selected ? (
            <GlassCard className="bg-gradient-to-br from-cyan-400/10 to-fuchsia-500/10">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Region Focus</p>
              <h2 className="mt-3 font-display text-3xl text-white">{selected.name}</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Exposure</p>
                  <p className="mt-2 text-2xl font-bold text-white">{selected.exposure}</p>
                </div>
                <div className="rounded-2xl border border-cyan-300/10 bg-slate-950/45 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Economic Impact</p>
                  <p className="mt-2 text-2xl font-bold text-white">${formatCompact(selected.impact)}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                Latitude band: {selected.latitudeBand}. Hover additional zones on the map for local detail.
              </p>
            </GlassCard>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {data?.map((location) => (
          <GlassCard key={location.id} className="bg-gradient-to-br from-slate-950/70 to-cyan-400/5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{location.country}</p>
            <h3 className="mt-2 font-display text-2xl text-white">{location.name}</h3>
            <p className="mt-4 text-sm text-slate-300">Risk {Math.min(99, Math.round(location.risk * factor))}%</p>
            <p className="mt-2 text-sm text-slate-300">{location.exposure} transformers exposed</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

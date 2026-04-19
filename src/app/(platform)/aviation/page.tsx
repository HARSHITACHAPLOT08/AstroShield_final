"use client";

import { RouteMap } from "@/components/maps/route-map";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { useAviationData } from "@/hooks/use-platform-data";

export default function AviationPage() {
  const { data } = useAviationData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Aviation Impact"
        title="Aviation Impact Module"
        description="Evaluate polar route risk, GPS degradation zones, HF radio blackouts, and reroute tradeoffs in one flight-operations view."
        badge="Polar traffic monitored"
      />

      <GlassCard className="overflow-hidden bg-gradient-to-br from-slate-950/78 via-cyan-500/8 to-fuchsia-500/8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Route Map</p>
            <h2 className="font-display text-3xl text-white md:text-4xl">Safe versus unsafe corridors</h2>
            <p className="text-sm text-slate-400">Alternate paths glow in cyan while risk corridors pulse in place.</p>
          </div>
          <div className="rounded-full border border-cyan-300/15 bg-slate-950/50 px-4 py-2 text-xs uppercase tracking-[0.22em] text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
            Hover routes for flight details
          </div>
        </div>
        {data ? (
          <div className="mx-auto w-full max-w-[1240px] overflow-hidden rounded-[30px]">
            <RouteMap routes={data.routes} />
          </div>
        ) : null}
      </GlassCard>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.routes.map((route) => (
            <GlassCard key={route.id} className="bg-gradient-to-br from-cyan-400/10 via-slate-950/55 to-fuchsia-500/10 hover:shadow-[0_0_32px_rgba(34,211,238,0.12)]">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{route.airline}</p>
              <h2 className="mt-2 font-display text-2xl text-white">
                {route.from} to {route.to}
              </h2>
              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <p>ETA {route.eta}</p>
                <p>Risk {route.risk}</p>
                <p>Fuel delta +{route.fuelDelta}%</p>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <GlassCard className="bg-gradient-to-br from-slate-950/60 via-cyan-500/8 to-slate-950/50">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Operational Zones</p>
            <div className="mt-6 space-y-4">
              {data?.zones.map((zone) => (
                <div key={zone.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">{zone.name}</span>
                    <span className="text-slate-400">{zone.severity}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-900/80">
                    <div className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" style={{ width: `${zone.severity}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-slate-950/60 via-fuchsia-500/8 to-slate-950/50">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Historical Incidents</p>
            <div className="mt-6 space-y-4">
              {data?.incidents.map((incident) => (
                <div key={incident.date} className="rounded-2xl border border-cyan-300/10 bg-slate-950/55 p-4 transition duration-300 hover:border-cyan-300/30 hover:bg-slate-900/70 hover:shadow-[0_0_22px_rgba(34,211,238,0.12)]">
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">{incident.date}</p>
                  <p className="mt-2 text-slate-100">{incident.title}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

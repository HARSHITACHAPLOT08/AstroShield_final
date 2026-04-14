"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LineSignalChart } from "@/components/charts/line-signal-chart";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { SolarDisk } from "@/components/visuals/solar-disk";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useSolarMonitorData } from "@/hooks/use-platform-data";

export default function SolarMonitorPage() {
  const { data } = useSolarMonitorData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Solar Monitor"
        title="Live Solar Activity Monitor"
        description="Track CME trajectories, active regions, flare output, and the evolving Bz environment across the last 48 hours."
        badge="3 active regions"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {data?.cmes.map((cme) => (
          <GlassCard key={cme.name} className="bg-gradient-to-br from-amber-400/12 via-slate-950/40 to-rose-500/10">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{cme.direction}</p>
            <h2 className="mt-3 font-display text-3xl text-white">{cme.name}</h2>
            <div className="mt-5 flex justify-between text-sm text-slate-300">
              <span>{cme.speed} km/s</span>
              <span>ETA {cme.eta}</span>
              <span>{cme.confidence}% conf.</span>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        {data ? <SolarDisk regions={data.activeRegions} /> : null}
        {data ? (
          <LineSignalChart
            title="Solar Wind Bz 48h"
            labels={data.bz48h.map((item) => item.time)}
            datasets={[{ label: "Bz", data: data.bz48h.map((item) => item.value), color: "#f59e0b" }]}
          />
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Flare Feed</p>
          <div className="mt-5 overflow-hidden rounded-[24px] border border-cyan-300/10">
            <Table>
              <thead className="bg-slate-950/50">
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Peak</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </thead>
              <tbody>
                {data?.flares.map((flare) => (
                  <TableRow key={`${flare.time}-${flare.class}`}>
                    <TableCell>{flare.time}</TableCell>
                    <TableCell>{flare.class}</TableCell>
                    <TableCell>{flare.region}</TableCell>
                    <TableCell>{flare.peak}</TableCell>
                    <TableCell>{flare.impact}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Historical Timeline</p>
          <div className="mt-6 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.history}>
                <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(34,211,238,0.2)" }} />
                <Bar dataKey="events" fill="#22d3ee" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

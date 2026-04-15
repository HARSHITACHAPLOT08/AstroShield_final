"use client";

import { LineSignalChart } from "@/components/charts/line-signal-chart";
import { RechartsGlowBar } from "@/components/charts/recharts-glow-bar";
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
          <GlassCard
            key={cme.name}
            className="border-amber-300/18 bg-gradient-to-br from-amber-400/14 via-slate-950/50 to-rose-500/12 transition hover:border-amber-300/45 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-amber-100/85">CME Direction</p>
            <h2 className="mt-2 text-lg font-semibold text-white/90">{formatCmeName(cme.name)}</h2>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-amber-200">{cme.direction}</p>
            <div className="mt-5 flex justify-between text-sm text-slate-200">
              <span>{cme.speed} km/s</span>
              <span>ETA {cme.eta}</span>
              <span>{cme.confidence}% conf.</span>
            </div>
            <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        {data ? <SolarDisk regions={data.activeRegions} /> : null}
        {data ? (
          <LineSignalChart
            title="Solar Wind Bz 48h"
            labels={data.bz48h.map((item) => item.time)}
            dynamic={true}
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

        <RechartsGlowBar
          title="Historical Timeline"
          description="CME events recorded over the past 30 days"
          data={data?.history ?? []}
          dataKey="events"
          dateKey="date"
          color="#22d3ee"
          height={280}
        />
      </div>
    </div>
  );
}

function formatCmeName(name: string) {
  const cleaned = name.replace(/[-_]/g, " ").trim();
  if (cleaned.length <= 22) {
    return cleaned;
  }

  const cmeIdMatch = cleaned.match(/CME\s*\d+/i);
  if (cmeIdMatch?.[0]) {
    return cmeIdMatch[0].toUpperCase();
  }

  return `${cleaned.slice(0, 22)}...`;
}

"use client";

import { motion } from "framer-motion";
import { LineSignalChart } from "@/components/charts/line-signal-chart";
import { RechartsGlowBar } from "@/components/charts/recharts-glow-bar";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { SolarDisk } from "@/components/visuals/solar-disk";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useSolarMonitorData } from "@/hooks/use-platform-data";
import { cn } from "@/lib/utils";

export default function SolarMonitorPage() {
  const { data } = useSolarMonitorData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Solar Monitor"
        title="Live Solar Activity Monitor"
        description="Track CME trajectories, active regions, flare output, and the evolving Bz environment across the last 48 hours."
        badge={`${data?.activeRegions.length ?? 0} active regions`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {data?.cmes.map((cme, index) => {
          const tone = getCmeTone(cme.direction, cme.speed, cme.confidence);

          return (
            <motion.div
              key={cme.name}
              initial={{ opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.08, duration: 0.45, ease: "easeOut" }}
            >
              <GlassCard
                className={cn(
                  "group relative border bg-gradient-to-br transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_38px_rgba(56,189,248,0.24)]",
                  tone.card
                )}
              >
                <motion.div
                  className={cn("pointer-events-none absolute -right-10 -top-8 h-40 w-40 rounded-full blur-3xl", tone.glow)}
                  animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.95, 1.06, 0.95] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                />
                <motion.div
                  className="pointer-events-none absolute -left-14 bottom-0 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl"
                  animate={{ opacity: [0.18, 0.44, 0.18], scale: [0.92, 1.08, 0.92] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 + index * 0.14 }}
                />

                <div className="flex items-start justify-between gap-3">
                  <p className={cn("text-xs uppercase tracking-[0.24em]", tone.labelText)}>CME Direction</p>
                  <motion.span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(56,189,248,0.18)]",
                      tone.pill
                    )}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {tone.label}
                  </motion.span>
                </div>

                <h2 className="mt-3 text-[27px] font-semibold leading-none text-white [text-shadow:0_0_20px_rgba(255,255,255,0.16)]">
                  {formatCmeName(cme.name)}
                </h2>
                <p className={cn("mt-3 text-sm uppercase tracking-[0.2em]", tone.directionText)}>{cme.direction}</p>

                <div className="mt-5 grid grid-cols-3 gap-2 text-sm text-slate-100">
                  <motion.div
                    whileHover={{ y: -2, scale: 1.01 }}
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(34,211,238,0.16)",
                        "0 0 24px rgba(34,211,238,0.38)",
                        "0 0 0 rgba(34,211,238,0.16)"
                      ],
                      borderColor: [
                        "rgba(34,211,238,0.28)",
                        "rgba(103,232,249,0.72)",
                        "rgba(34,211,238,0.28)"
                      ]
                    }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 + 0 }}
                    className="rounded-xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/15 to-slate-950/70 px-2 py-2 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/90">Speed</p>
                    <p className="mt-1 font-semibold text-cyan-50 [text-shadow:0_0_14px_rgba(34,211,238,0.38)]">{cme.speed} km/s</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.01 }}
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(217,70,239,0.14)",
                        "0 0 24px rgba(232,121,249,0.36)",
                        "0 0 0 rgba(217,70,239,0.14)"
                      ],
                      borderColor: [
                        "rgba(217,70,239,0.26)",
                        "rgba(240,171,252,0.68)",
                        "rgba(217,70,239,0.26)"
                      ]
                    }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 + 1.05 }}
                    className="rounded-xl border border-fuchsia-300/25 bg-gradient-to-br from-fuchsia-500/14 to-slate-950/70 px-2 py-2 shadow-[0_0_20px_rgba(217,70,239,0.2)] transition"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-fuchsia-200/90">ETA</p>
                    <p className="mt-1 font-semibold text-fuchsia-50 [text-shadow:0_0_14px_rgba(232,121,249,0.34)]">{cme.eta}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.01 }}
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(132,204,22,0.14)",
                        "0 0 24px rgba(163,230,53,0.36)",
                        "0 0 0 rgba(132,204,22,0.14)"
                      ],
                      borderColor: [
                        "rgba(132,204,22,0.26)",
                        "rgba(190,242,100,0.68)",
                        "rgba(132,204,22,0.26)"
                      ]
                    }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 + 2.1 }}
                    className="rounded-xl border border-lime-300/25 bg-gradient-to-br from-lime-500/14 to-slate-950/70 px-2 py-2 shadow-[0_0_20px_rgba(132,204,22,0.2)] transition"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-lime-200/90">Confidence</p>
                    <p className="mt-1 font-semibold text-lime-50 [text-shadow:0_0_14px_rgba(163,230,53,0.34)]">{cme.confidence}%</p>
                  </motion.div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-200">
                    <span>Trajectory confidence</span>
                    <span className="text-white">{cme.confidence}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
                    <motion.div
                      className={cn("h-full rounded-full", tone.bar)}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(6, Math.min(100, cme.confidence))}%` }}
                      transition={{ duration: 0.9, delay: 0.1 + index * 0.08, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className={cn("mt-3 h-px w-full bg-gradient-to-r from-transparent to-transparent", tone.separator)} />
              </GlassCard>
            </motion.div>
          );
        })}
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
  const cleaned = name.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
  const withoutTimestamp = cleaned
    .replace(/^\d{2}\s*\d{2}T\d{2}:\d{2}:\d{2}\s*/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\s*/i, "")
    .trim();

  const normalized = withoutTimestamp || cleaned;

  const cmeIdMatch = normalized.match(/CME\s*\d+/i);
  if (cmeIdMatch?.[0]) {
    return cmeIdMatch[0].toUpperCase();
  }

  if (normalized.length <= 22) {
    return normalized;
  }

  return `${normalized.slice(0, 22)}...`;
}

function getCmeTone(direction: string, speed: number, confidence: number) {
  const normalizedDirection = direction.toLowerCase();

  if (normalizedDirection.includes("earth") || confidence >= 75 || speed >= 1000) {
    return {
      label: "High Impact",
      card: "border-rose-300/35 from-rose-500/18 via-slate-950/55 to-amber-500/10 hover:border-rose-300/55",
      glow: "bg-rose-300/35",
      pill: "border-rose-300/40 bg-rose-400/15 text-rose-100",
      bar: "bg-gradient-to-r from-rose-400 to-amber-300 shadow-[0_0_14px_rgba(251,113,133,0.5)]",
      labelText: "text-rose-100/90",
      directionText: "text-rose-200/95",
      separator: "via-rose-200/28"
    };
  }

  if (normalizedDirection.includes("glancing") || confidence >= 55) {
    return {
      label: "Elevated",
      card: "border-amber-300/24 from-amber-400/15 via-slate-950/52 to-cyan-500/8 hover:border-amber-300/45",
      glow: "bg-amber-300/30",
      pill: "border-amber-300/35 bg-amber-400/12 text-amber-100",
      bar: "bg-gradient-to-r from-amber-300 to-yellow-200 shadow-[0_0_14px_rgba(252,211,77,0.48)]",
      labelText: "text-amber-100/90",
      directionText: "text-amber-200/95",
      separator: "via-amber-200/28"
    };
  }

  return {
    label: "Watch",
    card: "border-cyan-300/24 from-cyan-500/12 via-slate-950/55 to-indigo-500/10 hover:border-cyan-300/45",
    glow: "bg-cyan-300/25",
    pill: "border-cyan-300/35 bg-cyan-400/12 text-cyan-100",
    bar: "bg-gradient-to-r from-cyan-300 to-sky-200 shadow-[0_0_14px_rgba(34,211,238,0.48)]",
    labelText: "text-cyan-100/90",
    directionText: "text-cyan-200/95",
    separator: "via-cyan-200/28"
  };
}

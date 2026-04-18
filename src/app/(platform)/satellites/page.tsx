"use client";

import { motion } from "framer-motion";
import { LineSignalChart } from "@/components/charts/line-signal-chart";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { OrbitMap } from "@/components/visuals/orbit-map";
import { useSatelliteData } from "@/hooks/use-platform-data";
import { cn } from "@/lib/utils";

export default function SatellitesPage() {
  const { data } = useSatelliteData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Satellite Monitor"
        title="Satellite Risk Monitor"
        description="Track exposure across LEO, MEO, and GEO assets with radiation and atmospheric drag indicators."
        badge={`${data?.assets.length ?? 0} assets in view`}
      />

      <div className="space-y-6">
        {data ? (
          <div className="mx-auto w-full max-w-[1360px]">
            <OrbitMap assets={data.assets} />
          </div>
        ) : null}

        {data ? (
          <div className="mx-auto w-full max-w-[1360px]">
            <LineSignalChart
              title="Radiation and Drag Exposure"
              labels={data.exposure.map((item) => item.time)}
              dynamic
              datasets={[
                { label: "Radiation", data: data.exposure.map((item) => item.radiation), color: "#f472b6" },
                { label: "Drag", data: data.exposure.map((item) => item.drag), color: "#22d3ee" }
              ]}
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {data?.assets.map((asset, index) => {
            const tone = getAssetTone(asset.risk);

            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.42, delay: index * 0.08, ease: "easeOut" }}
              >
                <GlassCard
                  className={cn(
                    "group relative overflow-hidden border bg-gradient-to-br transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_34px_rgba(34,211,238,0.24)]",
                    tone.card
                  )}
                >
                  <motion.div
                    className={cn("pointer-events-none absolute -right-12 -top-10 h-36 w-36 rounded-full blur-3xl", tone.glow)}
                    animate={{ opacity: [0.25, 0.7, 0.25], scale: [0.95, 1.08, 0.95] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
                  />

                  <p className={cn("text-xs uppercase tracking-[0.28em]", tone.operator)}>{asset.operator}</p>
                  <h2 className="mt-2 text-[2.1rem] font-semibold leading-none text-white [text-shadow:0_0_16px_rgba(255,255,255,0.14)]">
                    {asset.name}
                  </h2>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <motion.div
                      whileHover={{ y: -2, scale: 1.01 }}
                      className={cn(
                        "rounded-2xl border p-4 transition",
                        tone.metricLeft
                      )}
                    >
                      <p className={cn("text-xs uppercase tracking-[0.24em]", tone.metricLabel)}>Orbit</p>
                      <p className={cn("mt-2 text-2xl font-semibold", tone.metricValue)}>{asset.orbit}</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -2, scale: 1.01 }}
                      className={cn(
                        "rounded-2xl border p-4 transition",
                        tone.metricRight
                      )}
                    >
                      <p className={cn("text-xs uppercase tracking-[0.24em]", tone.metricLabel)}>Risk</p>
                      <p className={cn("mt-2 text-2xl font-semibold", tone.metricValue)}>{asset.risk}</p>
                    </motion.div>
                  </div>

                  <p className="mt-4 text-sm text-slate-200/90 [text-shadow:0_0_14px_rgba(255,255,255,0.08)]">
                    Radiation {asset.radiation}% | Atmospheric drag {asset.drag}%
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <GlassCard>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-300">Impacted Satellite Alerts</p>
          <div className="mt-6 space-y-4">
            {data?.alerts.map((alert, index) => (
              <motion.div
                key={alert}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.36, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ x: 4, scale: 1.01 }}
                className="group rounded-2xl border border-fuchsia-300/20 bg-gradient-to-r from-fuchsia-500/14 via-slate-950/70 to-cyan-500/10 p-4 text-slate-100 shadow-[0_0_20px_rgba(217,70,239,0.12)] transition hover:border-fuchsia-300/45 hover:shadow-[0_0_28px_rgba(217,70,239,0.22)]"
              >
                <div className="pointer-events-none absolute h-0 w-0" />
                <p className="text-base leading-relaxed text-white [text-shadow:0_0_14px_rgba(255,255,255,0.1)]">{alert}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function getAssetTone(risk: string) {
  switch (risk) {
    case "Critical":
      return {
        card: "border-rose-300/30 from-rose-500/18 via-slate-950/70 to-fuchsia-500/10 hover:border-rose-300/55",
        glow: "bg-rose-300/35",
        operator: "text-rose-100/90",
        metricLeft: "border-cyan-300/18 bg-gradient-to-br from-cyan-500/12 to-slate-950/82",
        metricRight: "border-rose-300/24 bg-gradient-to-br from-rose-500/14 to-slate-950/82",
        metricLabel: "text-slate-300",
        metricValue: "text-white"
      };
    case "High":
      return {
        card: "border-amber-300/28 from-amber-500/16 via-slate-950/72 to-cyan-500/8 hover:border-amber-300/50",
        glow: "bg-amber-300/30",
        operator: "text-amber-100/90",
        metricLeft: "border-cyan-300/18 bg-gradient-to-br from-cyan-500/12 to-slate-950/82",
        metricRight: "border-amber-300/24 bg-gradient-to-br from-amber-500/14 to-slate-950/82",
        metricLabel: "text-slate-300",
        metricValue: "text-white"
      };
    case "Moderate":
      return {
        card: "border-cyan-300/24 from-cyan-500/14 via-slate-950/72 to-indigo-500/10 hover:border-cyan-300/50",
        glow: "bg-cyan-300/28",
        operator: "text-cyan-100/90",
        metricLeft: "border-cyan-300/18 bg-gradient-to-br from-cyan-500/12 to-slate-950/82",
        metricRight: "border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-500/14 to-slate-950/82",
        metricLabel: "text-slate-300",
        metricValue: "text-white"
      };
    default:
      return {
        card: "border-emerald-300/24 from-emerald-500/12 via-slate-950/72 to-cyan-500/8 hover:border-emerald-300/48",
        glow: "bg-emerald-300/28",
        operator: "text-emerald-100/90",
        metricLeft: "border-cyan-300/18 bg-gradient-to-br from-cyan-500/12 to-slate-950/82",
        metricRight: "border-emerald-300/20 bg-gradient-to-br from-emerald-500/14 to-slate-950/82",
        metricLabel: "text-slate-300",
        metricValue: "text-white"
      };
  }
}

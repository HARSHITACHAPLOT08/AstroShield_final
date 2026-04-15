"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Minimize2, Satellite } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import type { SatelliteAsset } from "@/types";
import { cn } from "@/lib/utils";

const orbitRadius = {
  LEO: 28,
  MEO: 45,
  GEO: 62
};

const orbitStartAngle = {
  LEO: 16,
  MEO: 92,
  GEO: 168
};

const orbitColor = {
  Low: "#22c55e",
  Moderate: "#f59e0b",
  High: "#38bdf8",
  Critical: "#ec4899"
};

export function OrbitMap({ assets }: { assets: SatelliteAsset[] }) {
  const [expanded, setExpanded] = useState(false);

  const orbitGroups = useMemo(
    () => ({
      LEO: assets.filter((asset) => asset.orbit === "LEO"),
      MEO: assets.filter((asset) => asset.orbit === "MEO"),
      GEO: assets.filter((asset) => asset.orbit === "GEO")
    }),
    [assets]
  );

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [expanded]);

  return (
    <>
      <GlassCard className="h-full">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Orbit Monitor</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Double-click visual to enlarge</p>
        </div>

        <OrbitCanvas assets={assets} orbitGroups={orbitGroups} className="mt-6" onDoubleClick={() => setExpanded(true)} />
      </GlassCard>

      {expanded ? (
        <div className="fixed inset-0 z-[80] bg-[rgba(2,6,23,0.86)] p-4 backdrop-blur-md" onClick={() => setExpanded(false)}>
          <div className="mx-auto flex h-full max-w-[1300px] items-center justify-center">
            <div
              className="glass-panel relative w-full max-w-[1080px] rounded-[30px] p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Expanded Orbit View</p>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/8 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-cyan-100 hover:bg-cyan-300/16"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                  Close
                </button>
              </div>
              <OrbitCanvas assets={assets} orbitGroups={orbitGroups} enlarged />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function OrbitCanvas({
  assets,
  orbitGroups,
  className,
  enlarged = false,
  onDoubleClick
}: {
  assets: SatelliteAsset[];
  orbitGroups: Record<"LEO" | "MEO" | "GEO", SatelliteAsset[]>;
  className?: string;
  enlarged?: boolean;
  onDoubleClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-[26px] border border-cyan-300/10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),rgba(2,6,23,0.88)_58%)]",
        className
      )}
      onDoubleClick={onDoubleClick}
    >
      <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/15" />

      <div className={cn("absolute h-32 w-32 rounded-full shadow-[0_0_70px_rgba(56,189,248,0.24)]", enlarged && "h-44 w-44")}>
        <div className="relative h-full w-full overflow-hidden rounded-full border border-sky-200/30 bg-[radial-gradient(circle_at_36%_30%,rgba(147,197,253,0.95),rgba(14,116,144,0.9)_42%,rgba(2,44,68,0.96)_78%)]">
          <div className="absolute -left-1 top-[26%] h-8 w-12 rotate-12 rounded-[50%] bg-emerald-200/38 blur-[1px]" />
          <div className="absolute right-1 top-[44%] h-7 w-10 -rotate-6 rounded-[48%] bg-green-200/32 blur-[1px]" />
          <div className="absolute left-[34%] top-[56%] h-6 w-9 rotate-[22deg] rounded-[46%] bg-amber-200/22 blur-[1px]" />
          <div className="absolute left-[52%] top-[24%] h-5 w-7 rotate-[8deg] rounded-[45%] bg-emerald-100/24 blur-[1px]" />
          <div className="absolute inset-x-[20%] top-[16%] h-4 rounded-full bg-white/26 blur-md" />
          <div className="absolute inset-x-[26%] bottom-[22%] h-3 rounded-full bg-white/16 blur-sm" />
        </div>
      </div>

      {(["LEO", "MEO", "GEO"] as const).map((orbit) => (
        <div
          key={orbit}
          className="absolute rounded-full border border-dashed border-cyan-300/18"
          style={{ width: `${orbitRadius[orbit] * 2}%`, height: `${orbitRadius[orbit] * 2}%` }}
        >
          <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-slate-950/72 px-2 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-400">
            {orbit}
          </span>
        </div>
      ))}

      {assets.map((asset, index) => {
        const orbitPeers = orbitGroups[asset.orbit];
        const orbitIndex = orbitPeers.findIndex((candidate) => candidate.id === asset.id);
        const spread = 360 / Math.max(orbitPeers.length, 4);
        const longitudeBias = ((asset.longitude + 180) % 360) / 8;
        const angle = orbitStartAngle[asset.orbit] + orbitIndex * spread + longitudeBias;
        const direction = index % 2 === 0 ? 360 : -360;
        const duration = 20 + orbitIndex * 2.2 + (asset.orbit === "GEO" ? 12 : asset.orbit === "MEO" ? 7 : 0);

        return (
          <motion.div
            key={asset.id}
            className="absolute inset-0"
            animate={{ rotate: [angle, angle + direction] }}
            transition={{ duration, ease: "linear", repeat: Infinity }}
          >
            <motion.div
              className="absolute left-1/2 top-1/2"
              style={{ transform: `translate(-50%, -50%) translateY(-${orbitRadius[asset.orbit]}%)` }}
              animate={{ rotate: [-angle, -(angle + direction)] }}
              transition={{ duration, ease: "linear", repeat: Infinity }}
            >
              <SatelliteMarker asset={asset} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function SatelliteMarker({ asset }: { asset: SatelliteAsset }) {
  const color = orbitColor[asset.risk];

  return (
    <div className="group relative">
      <span
        className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
        style={{ backgroundColor: `${color}66` }}
      />
      <div className="relative flex items-center gap-2">
        <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/35 bg-slate-950/80 shadow-[0_0_20px_rgba(255,255,255,0.16)]">
          <Satellite className="h-4 w-4" style={{ color }} />
          <span className="absolute -left-2 top-1/2 h-1.5 w-2 -translate-y-1/2 rounded-sm" style={{ backgroundColor: color }} />
          <span className="absolute -right-2 top-1/2 h-1.5 w-2 -translate-y-1/2 rounded-sm" style={{ backgroundColor: color }} />
        </span>

        <div className="rounded-xl border border-cyan-300/20 bg-slate-950/90 px-2.5 py-1.5 text-[11px] leading-tight text-slate-200 shadow-[0_8px_26px_rgba(2,6,23,0.5)]">
          <p className="font-semibold text-white">{asset.name}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
            {asset.orbit} orbit · Radiation {asset.radiation}%
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute left-10 top-8 z-10 w-44 rounded-2xl border border-cyan-300/15 bg-slate-950/92 p-3 text-xs text-slate-200 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100">
        <p className="font-semibold text-white">{asset.operator}</p>
        <p className="mt-1">Risk: {asset.risk}</p>
        <p className="mt-1">Atmospheric drag {asset.drag}%</p>
      </div>
    </div>
  );
}

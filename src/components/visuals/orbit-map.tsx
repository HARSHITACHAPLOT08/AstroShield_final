"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import type { SatelliteAsset } from "@/types";

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
  return (
    <GlassCard className="h-full">
      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Orbit Monitor</p>
      <div className="relative mt-6 flex aspect-square items-center justify-center overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),rgba(2,6,23,0.86)_55%)]">
        <div className="absolute h-28 w-28 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(125,211,252,0.95),rgba(2,132,199,0.86)_45%,rgba(15,23,42,0.92)_80%)] shadow-[0_0_60px_rgba(56,189,248,0.28)]" />
        <div className="animate-orbit-pulse absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

        {(["LEO", "MEO", "GEO"] as const).map((orbit) => (
          <div
            key={orbit}
            className="absolute rounded-full border border-dashed border-cyan-300/15"
            style={{ width: `${orbitRadius[orbit] * 2}%`, height: `${orbitRadius[orbit] * 2}%` }}
          >
            <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-slate-950/70 px-2 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-400">
              {orbit}
            </span>
          </div>
        ))}

        {assets.map((asset, index) => {
          const orbitPeers = assets.filter((candidate) => candidate.orbit === asset.orbit);
          const orbitIndex = orbitPeers.findIndex((candidate) => candidate.id === asset.id);
          const angle = orbitStartAngle[asset.orbit] + orbitIndex * (360 / Math.max(orbitPeers.length, 3));
          const direction = index % 2 === 0 ? 360 : -360;

          return (
            <motion.div
              key={asset.id}
              className="absolute inset-0"
              animate={{ rotate: [angle, angle + direction] }}
              transition={{ duration: 22 + orbitIndex * 3 + index * 1.5, ease: "linear", repeat: Infinity }}
            >
              <div
                className="group absolute left-1/2 top-1/2"
                style={{ transform: `translate(-50%, -50%) translateY(-${orbitRadius[asset.orbit]}%)` }}
              >
                <span
                  className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
                  style={{ backgroundColor: `${orbitColor[asset.risk]}55` }}
                />
                <span
                  className="relative block h-4 w-4 rounded-full border border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  style={{ backgroundColor: orbitColor[asset.risk] }}
                />
                <div className="pointer-events-none absolute left-6 top-1/2 w-44 -translate-y-1/2 rounded-2xl border border-cyan-300/15 bg-slate-950/90 p-3 text-xs text-slate-200 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  <p className="font-semibold text-white">{asset.name}</p>
                  <p className="mt-1">{asset.orbit} orbit</p>
                  <p className="mt-1">{asset.operator}</p>
                  <p className="mt-1">Radiation {asset.radiation}%</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

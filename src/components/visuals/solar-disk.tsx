"use client";

import { motion } from "framer-motion";

export function SolarDisk({
  regions
}: {
  regions: Array<{ region: string; class: string; flareRisk: number; x: number; y: number }>;
}) {
  return (
    <div className="glass-panel relative flex h-[360px] items-center justify-center overflow-hidden rounded-[28px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.22),transparent_40%)]" />
      <div className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/10" />
      <div className="animate-orbit-pulse absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/12" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(254,240,138,0.98),rgba(251,191,36,0.96)_24%,rgba(251,146,60,0.92)_52%,rgba(234,88,12,0.84)_78%)] shadow-[0_0_90px_rgba(251,146,60,0.38)]"
        animate={{ rotate: 360, scale: [0.99, 1.02, 0.99] }}
        transition={{
          rotate: { duration: 40, ease: "linear", repeat: Infinity },
          scale: { duration: 7, ease: "easeInOut", repeat: Infinity }
        }}
      >
        <div className="absolute inset-[11%] rounded-full border border-amber-100/15" />
        <div className="absolute inset-[20%] rounded-full border border-amber-200/10" />
        <div className="absolute inset-x-[18%] top-[44%] h-[12%] rounded-full bg-amber-100/18 blur-2xl" />

        {regions.map((region, index) => (
          <motion.div
            key={region.region}
            className="group absolute"
            style={{ left: `${region.x}%`, top: `${region.y}%` }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.4 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="absolute -left-3 -top-3 h-8 w-8 rounded-full bg-amber-100/20 blur-xl" />
            <span className="absolute -left-2 -top-2 h-6 w-6 rounded-full border border-white/60" />
            <span className="relative block h-3 w-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.7)]" />
            <div className="pointer-events-none absolute left-5 top-1/2 w-40 -translate-y-1/2 rounded-2xl border border-amber-200/20 bg-slate-950/85 p-3 text-xs text-slate-200 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100">
              <p className="font-semibold text-white">{region.region}</p>
              <p className="mt-1">{region.class}</p>
              <p className="mt-1">Flare risk {region.flareRisk}%</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

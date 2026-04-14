"use client";

import { motion } from "framer-motion";

const orbitalTracks = [
  {
    size: "h-[76%] w-[76%]",
    color: "bg-cyan-300",
    glow: "from-cyan-300/60",
    start: 18,
    duration: 20
  },
  {
    size: "h-[88%] w-[88%]",
    color: "bg-fuchsia-300",
    glow: "from-fuchsia-300/55",
    start: 142,
    duration: 28
  },
  {
    size: "h-[98%] w-[98%]",
    color: "bg-sky-300",
    glow: "from-sky-300/55",
    start: 265,
    duration: 36
  }
] as const;

export function EarthScene({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative ${compact ? "h-[320px]" : "h-[520px]"} w-full`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_42%)]" />
      <div className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/8" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20 bg-[radial-gradient(circle_at_30%_30%,rgba(125,211,252,0.95),rgba(2,132,199,0.85)_30%,rgba(15,23,42,0.92)_76%)] shadow-[0_0_80px_rgba(34,211,238,0.18)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute inset-[18%] rounded-full border border-cyan-200/10" />
        <div className="absolute inset-x-[12%] top-[38%] h-[14%] rounded-full bg-cyan-200/10 blur-2xl" />
      </motion.div>

      {orbitalTracks.map((track, index) => (
        <motion.div
          key={track.start}
          className={`absolute left-1/2 top-1/2 ${track.size} -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-300/12`}
          animate={{ rotate: [track.start, track.start + (index % 2 === 0 ? 360 : -360)] }}
          transition={{ duration: track.duration, ease: "linear", repeat: Infinity }}
        >
          <div className={`absolute left-1/2 top-0 h-24 w-px -translate-x-1/2 bg-gradient-to-b ${track.glow} to-transparent`} />
          <div className={`absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full shadow-[0_0_18px_rgba(255,255,255,0.55)] ${track.color}`} />
        </motion.div>
      ))}

      <div className="animate-orbit-pulse absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/8" />
    </div>
  );
}

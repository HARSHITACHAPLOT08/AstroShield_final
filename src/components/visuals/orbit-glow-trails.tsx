"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type OrbitGlowTrailsProps = {
  className?: string;
};

const orbitRings = [
  { radius: 168, opacity: 0.34, dash: "9 10" },
  { radius: 228, opacity: 0.28, dash: "6 9" },
  { radius: 292, opacity: 0.24, dash: "4 8" },
  { radius: 358, opacity: 0.18, dash: "3 10" }
] as const;

const orbitDots = [
  { radius: 168, size: 5.5, duration: 10, color: "#7dd3fc", blur: 8, reverse: false },
  { radius: 228, size: 4.8, duration: 14, color: "#22d3ee", blur: 10, reverse: true },
  { radius: 292, size: 6.2, duration: 18, color: "#67e8f9", blur: 9, reverse: false },
  { radius: 358, size: 4.4, duration: 22, color: "#a5f3fc", blur: 11, reverse: true }
] as const;

export function OrbitGlowTrails({ className }: OrbitGlowTrailsProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[580px] w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ scale: [0.98, 1.03, 0.98], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg viewBox="0 0 1200 900" className="absolute inset-0 h-full w-full opacity-80" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="orbit-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.28)" />
            <stop offset="55%" stopColor="rgba(34,211,238,0.06)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </radialGradient>
          <filter id="orbit-neon-blur" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="4.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="600" cy="450" r="390" fill="url(#orbit-core-glow)" />

        {orbitRings.map((ring) => (
          <circle
            key={ring.radius}
            cx="600"
            cy="450"
            r={ring.radius}
            fill="none"
            stroke="rgba(34,211,238,0.52)"
            strokeWidth="1.15"
            strokeDasharray={ring.dash}
            opacity={ring.opacity}
            filter="url(#orbit-neon-blur)"
          />
        ))}

        {orbitDots.map((dot) => (
          <g key={`${dot.radius}-${dot.duration}`} transform="translate(600 450)">
            <motion.g
              animate={{ rotate: dot.reverse ? -360 : 360 }}
              transition={{ duration: dot.duration, repeat: Infinity, ease: "linear" }}
            >
              <circle cx={dot.radius} cy="0" r={dot.size * 2.2} fill={dot.color} opacity="0.14" filter="url(#orbit-neon-blur)" />
              <circle cx={dot.radius} cy="0" r={dot.size} fill={dot.color} style={{ filter: `drop-shadow(0 0 ${dot.blur}px ${dot.color})` }} />
            </motion.g>
          </g>
        ))}

        <g transform="translate(600 450)">
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 86, repeat: Infinity, ease: "linear" }}>
            <g transform="translate(330 0)">
              <motion.g
                animate={{ rotate: [0, 6, -8, 4, 0], y: [0, -1.5, 1, -0.6, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              >
                <ellipse rx="26" ry="10.5" fill="rgba(34,211,238,0.16)" filter="url(#orbit-neon-blur)" />
                <rect x="-7" y="-4.2" width="14" height="8.4" rx="2" fill="#dbeafe" />
                <rect x="-22" y="-3.3" width="11" height="6.6" rx="1.4" fill="#22d3ee" opacity="0.9" />
                <rect x="11" y="-3.3" width="11" height="6.6" rx="1.4" fill="#22d3ee" opacity="0.9" />
                <circle cx="0" cy="0" r="1.4" fill="#020617" opacity="0.8" />
              </motion.g>
            </g>
          </motion.g>
        </g>
      </svg>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SolarDisk({
  regions
}: {
  regions: Array<{ region: string; class: string; flareRisk: number; x: number; y: number }>;
}) {
  const [expanded, setExpanded] = useState(false);

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
      <div className="glass-panel relative overflow-hidden rounded-[28px]">
        <div className="flex items-center justify-between gap-3 px-4 pt-4">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-100/80">Solar Disk Activity</p>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-100 transition hover:bg-amber-300/20"
          >
            <Maximize2 className="h-3 w-3" />
            Enlarge
          </button>
        </div>
        <SolarDiskCanvas regions={regions} className="mt-3" onDoubleClick={() => setExpanded(true)} />
      </div>

      {expanded ? (
        <div className="fixed inset-0 z-[80] bg-[rgba(2,6,23,0.86)] p-4 backdrop-blur-md" onClick={() => setExpanded(false)}>
          <div className="mx-auto flex h-full max-w-[1300px] items-center justify-center">
            <div
              className="glass-panel relative w-full max-w-[1020px] rounded-[30px] p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.24em] text-amber-100">Expanded Solar Disk</p>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-300/12 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-amber-100 hover:bg-amber-300/24"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                  Close
                </button>
              </div>
              <SolarDiskCanvas regions={regions} enlarged className="h-[640px]" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SolarDiskCanvas({
  regions,
  enlarged = false,
  className,
  onDoubleClick
}: {
  regions: Array<{ region: string; class: string; flareRisk: number; x: number; y: number }>;
  enlarged?: boolean;
  className?: string;
  onDoubleClick?: () => void;
}) {
  return (
    <div
      className={cn("relative flex h-[360px] items-center justify-center overflow-hidden rounded-[28px]", className)}
      onDoubleClick={onDoubleClick}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.22),transparent_40%)]" />
      
      {/* Animated corona/heat glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[95%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/8"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.04, 1] }}
        transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
      />
      
      <div className="absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/10" />
      <div className="animate-orbit-pulse absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/12" />

      {/* Orbiting solar prominence */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 blur-lg opacity-60" />
      </motion.div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className={cn(
            "relative rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(254,240,138,0.98),rgba(251,191,36,0.96)_24%,rgba(251,146,60,0.92)_52%,rgba(234,88,12,0.84)_78%)] shadow-[0_0_90px_rgba(251,146,60,0.38)]",
            enlarged ? "h-[460px] w-[460px]" : "h-72 w-72"
          )}
          animate={{
            scale: [0.99, 1.02, 0.99],
            x: [0, 3, -2, 0],
            y: [0, -2, 2, 0],
            rotate: 360
          }}
          transition={{
            scale: { duration: 7, ease: "easeInOut", repeat: Infinity },
            x: { duration: 12, ease: "easeInOut", repeat: Infinity },
            y: { duration: 10, ease: "easeInOut", repeat: Infinity },
            rotate: { duration: 95, ease: "linear", repeat: Infinity }
          }}
        >
          {/* Inner rotating corona */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,200,0.12),transparent_60%)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          />

          {/* Rotating convection band for surface movement */}
          <motion.div
            className="absolute inset-[6%] rounded-full"
            style={{
              background:
                "conic-gradient(from_0deg,transparent_0deg,rgba(255,214,102,0.16)_48deg,transparent_112deg,rgba(255,153,51,0.12)_172deg,transparent_236deg,rgba(255,237,160,0.16)_300deg,transparent_360deg)"
            }}
            animate={{ rotate: [0, 360], opacity: [0.35, 0.58, 0.35] }}
            transition={{ duration: 26, ease: "linear", repeat: Infinity }}
          />
          
          {/* Surface texture shimmer */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 30%, rgba(255,200,100,0.1) 60%, transparent 100%)"
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          />
          
          {/* Heat shimmer/flicker effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(254,215,0,0.08) 0%, transparent 70%)"
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
          />

          <div className="absolute inset-[11%] rounded-full border border-amber-100/15" />
          <div className="absolute inset-[20%] rounded-full border border-amber-200/10" />
          <div className="absolute inset-x-[18%] top-[44%] h-[12%] rounded-full bg-amber-100/18 blur-2xl" />

          {regions.map((region, index) => (
            <motion.div
              key={region.region}
              className="group absolute"
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              animate={{
                x: [0, 1.6 + index * 0.25, -1.2 - index * 0.18, 0],
                y: [0, -1.2 - index * 0.2, 1 + index * 0.15, 0]
              }}
              transition={{ duration: 6.2 + index * 0.8, ease: "easeInOut", repeat: Infinity }}
            >
              {/* Flare risk indicator pulsing glow */}
              <motion.span
                className="absolute -left-3 -top-3 h-8 w-8 rounded-full blur-xl"
                animate={{ 
                  opacity: [0.4, 0.9, 0.4],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 1.8 + (region.flareRisk / 100) * 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: `radial-gradient(circle, rgba(255,200,100,0.8), transparent)`
                }}
              />
              
              {/* Region hotspot with enhanced animation */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2.4 + index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <span className="absolute -left-2 -top-2 h-6 w-6 rounded-full border border-white/60" />
                <span className="relative block h-3 w-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.7)]" />
              </motion.div>
              
              <div className="pointer-events-none absolute left-5 top-1/2 w-40 -translate-y-1/2 rounded-2xl border border-amber-200/20 bg-slate-950/85 p-3 text-xs text-slate-200 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:border-amber-300/45 group-hover:opacity-100">
                <p className="font-semibold text-white">{region.region}</p>
                <p className="mt-1">{region.class}</p>
                <p className="mt-1 flex items-center gap-2">
                  <span>Flare risk {region.flareRisk}%</span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";

export function GeomagneticMeter({
  items
}: {
  items: Array<{ name: string; value: number }>;
}) {
  const [tick, setTick] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1200);

    return () => window.clearInterval(timer);
  }, []);

  const animatedItems = useMemo(
    () =>
      items.map((item, index) => {
        const base = item.value > 0 ? item.value : 14 + index * 12;
        const wave = Math.sin(tick * 0.5 + index * 0.8) * 3.4;
        const displayValue = Math.max(5, Math.min(99, Math.round(base + wave)));
        return {
          ...item,
          displayValue,
          isElevated: displayValue >= 65,
          isCritical: displayValue >= 82
        };
      }),
    [items, tick]
  );

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Geomagnetic Scale</p>
        <span className="rounded-full border border-cyan-300/30 bg-cyan-400/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
          Live
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {animatedItems.map((item, index) => {
          const active = hovered === item.name;
          const barTone = item.isCritical
            ? "from-rose-400 via-fuchsia-500 to-violet-500"
            : item.isElevated
              ? "from-amber-300 via-orange-400 to-fuchsia-500"
              : "from-cyan-300 via-blue-400 to-violet-500";

          return (
            <motion.div
              key={item.name}
              className="rounded-xl p-1 transition"
              onHoverStart={() => setHovered(item.name)}
              onHoverEnd={() => setHovered(null)}
              animate={{
                boxShadow: active ? "0 0 0 1px rgba(34,211,238,0.28), 0 0 24px rgba(34,211,238,0.18)" : "0 0 0 0 rgba(0,0,0,0)"
              }}
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-white">{item.name}</span>
                <span className={item.isCritical ? "text-rose-300" : item.isElevated ? "text-amber-300" : "text-cyan-200"}>
                  {item.displayValue}%
                </span>
              </div>

              <div className="relative h-3 overflow-hidden rounded-full bg-slate-900/80">
                <motion.div
                  className={`h-3 rounded-full bg-gradient-to-r ${barTone}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.displayValue}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />

                <motion.div
                  className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.46),transparent)]"
                  animate={{ x: [0, 220, 0] }}
                  transition={{ duration: 2.2 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-400 opacity-80">
                {item.isCritical
                  ? "Severe disturbance likely."
                  : item.isElevated
                    ? "Elevated activity with moderate infrastructure impact."
                    : "Quiet to unsettled geomagnetic conditions."}
              </p>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

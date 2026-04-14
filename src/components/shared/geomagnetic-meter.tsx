"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";

export function GeomagneticMeter({
  items
}: {
  items: Array<{ name: string; value: number }>;
}) {
  return (
    <GlassCard className="h-full">
      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Geomagnetic Scale</p>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-white">{item.name}</span>
              <span className="text-slate-400">{item.value}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-900/80">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
                initial={{ width: 0 }}
                whileInView={{ width: `${item.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

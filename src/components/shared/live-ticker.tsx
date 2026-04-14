"use client";

import { motion } from "framer-motion";

export function LiveTicker({
  items
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="glass-panel overflow-hidden rounded-full px-4 py-3">
      <motion.div className="flex min-w-max gap-10" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        {[...items, ...items].map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center gap-3 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.8)]" />
            <span className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</span>
            <span className="font-semibold text-white">{item.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

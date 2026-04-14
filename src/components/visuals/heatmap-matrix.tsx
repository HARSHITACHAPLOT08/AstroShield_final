"use client";

import { GlassCard } from "@/components/shared/glass-card";

export function HeatmapMatrix({ matrix }: { matrix: number[][] }) {
  const rows = ["Actual Storm", "Actual Calm"];
  const cols = ["Predicted Calm", "Predicted Storm"];

  return (
    <GlassCard>
      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Model Evaluation</p>
      <h3 className="mt-2 font-display text-2xl text-white">Confusion Matrix</h3>
      <div className="mt-5 grid grid-cols-[110px_repeat(2,minmax(0,1fr))] gap-3">
        <div />
        {cols.map((col) => (
          <div key={col} className="text-center text-xs uppercase tracking-[0.22em] text-slate-400">
            {col}
          </div>
        ))}
        {matrix.map((row, rowIndex) => (
          <div key={rows[rowIndex]} className="contents">
            <div className="flex items-center text-xs uppercase tracking-[0.22em] text-slate-400">{rows[rowIndex]}</div>
            {row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="flex h-24 items-center justify-center rounded-3xl border border-cyan-300/10 bg-gradient-to-br from-cyan-400/10 to-fuchsia-500/10 text-2xl font-bold text-white"
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

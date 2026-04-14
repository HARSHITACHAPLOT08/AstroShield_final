"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { formatPercent } from "@/lib/utils";

export function PredictionChart({
  title,
  probability,
  confidence
}: {
  title: string;
  probability: number;
  confidence: number;
}) {
  const data = [{ name: title, probability, confidence, fill: "#22d3ee" }];

  return (
    <GlassCard>
      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{title}</p>
      <div className="mt-4 grid items-center gap-4 md:grid-cols-[1fr_110px]">
        <div>
          <p className="font-display text-4xl text-white">{formatPercent(probability)}</p>
          <p className="mt-2 text-sm text-slate-400">Model confidence {formatPercent(confidence)}</p>
        </div>
        <div className="h-28 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart data={data} innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={12}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="probability" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}

"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { GlassCard } from "@/components/shared/glass-card";

interface RechartData {
  subject?: string;
  [key: string]: string | number | undefined;
}

export function RechartsGlowRadar({
  title,
  description,
  data,
  datasets,
  height = 320
}: {
  title: string;
  description?: string;
  data: RechartData[];
  datasets: Array<{ key: string; stroke: string; fill: string }>;
  height?: number;
}) {
  return (
    <GlassCard>
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{title}</p>
        {description && <p className="text-sm text-slate-300">{description}</p>}
      </div>

      <div className="relative mt-6">
        <div
          className="rounded-[16px] border border-cyan-300/15 bg-slate-950/40 p-3"
          style={{ height: `${height}px` }}
        >
          {/* Glow SVG Filter */}
          <svg width="0" height="0">
            <defs>
              <filter id="glow-radar-filter">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid stroke="rgba(148,163,184,0.16)" />
              <PolarAngleAxis
                dataKey="subject"
                stroke="#94a3b8"
                style={{ fontSize: "11px", fontFamily: "var(--font-space)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(3,10,25,0.98)",
                  border: "1px solid rgba(0,212,255,0.4)",
                  borderRadius: "8px",
                  boxShadow: "0 0 20px rgba(0,212,255,0.2)"
                }}
                labelStyle={{ color: "#e0f2fe", fontSize: "12px" }}
              />
              {datasets.map((dataset, idx) => (
                <Radar
                  key={`${dataset.key}-${idx}`}
                  dataKey={dataset.key}
                  stroke={dataset.stroke}
                  fill={dataset.fill}
                  isAnimationActive={true}
                  animationDuration={1200}
                  style={{
                    filter: "url(#glow-radar-filter)"
                  }}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}

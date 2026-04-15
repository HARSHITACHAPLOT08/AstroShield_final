"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { GlassCard } from "@/components/shared/glass-card";

interface RechartData {
  [key: string]: string | number;
}

export function RechartsGlowBar({
  title,
  description,
  data,
  dataKey,
  color = "#22d3ee",
  dateKey = "date",
  height = 280
}: {
  title: string;
  description?: string;
  data: RechartData[];
  dataKey: string;
  color?: string;
  dateKey?: string;
  height?: number;
}) {
  return (
    <GlassCard>
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{title}</p>
        {description && <p className="text-sm text-slate-300">{description}</p>}
      </div>

      <div className="relative mt-6">
        <div className={`h-[${height}px] rounded-[16px] border border-cyan-300/15 bg-slate-950/40 p-3`}
          style={{ height: `${height}px` }}
        >
          {/* Glow SVG Filter */}
          <svg width="0" height="0">
            <defs>
              <filter id="glow-bar-filter">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis
                dataKey={dateKey}
                stroke="#94a3b8"
                style={{ fontSize: "11px", fontFamily: "var(--font-space)" }}
              />
              <YAxis
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
                formatter={(value: string | number) => [
                  <span key="val" style={{ color: color, fontWeight: 500 }}>
                    {value}
                  </span>,
                  dataKey
                ]}
              />
              <Bar
                dataKey={dataKey}
                fill="url(#barGradient)"
                radius={[14, 14, 0, 0]}
                style={{
                  filter: "url(#glow-bar-filter)",
                  animationDuration: "1.2s",
                  animationFillMode: "ease-in-out"
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}

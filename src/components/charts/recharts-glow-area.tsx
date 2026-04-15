"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { GlassCard } from "@/components/shared/glass-card";

interface RechartData {
  [key: string]: string | number;
}

export function RechartsGlowArea({
  title,
  description,
  data,
  dataKey,
  color = "#f472b6",
  dateKey = "date",
  height = 280,
  areaType = "monotone"
}: {
  title: string;
  description?: string;
  data: RechartData[];
  dataKey: string;
  color?: string;
  dateKey?: string;
  height?: number;
  areaType?: "monotone" | "linear" | "natural" | "stepAfter" | "stepBefore";
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
              <filter id="glow-area-filter">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
              </defs>
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
              <Area
                type={areaType}
                dataKey={dataKey}
                stroke={color}
                fill="url(#areaGradient)"
                strokeWidth={2.4}
                isAnimationActive={true}
                animationDuration={1200}
                style={{
                  filter: "url(#glow-area-filter)"
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}

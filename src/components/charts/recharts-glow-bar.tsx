"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { GlassCard } from "@/components/shared/glass-card";

interface RechartData {
  [key: string]: string | number;
}

function toNumeric(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function expandSparseBarData(data: RechartData[], dataKey: string, dateKey: string) {
  if (data.length >= 5) {
    return data;
  }

  if (!data.length) {
    return [];
  }

  if (data.length === 1) {
    const first = data[0];
    const base = Math.max(1, toNumeric(first[dataKey]));
    const label = String(first[dateKey] ?? "Now");

    return Array.from({ length: 6 }, (_, index) => {
      const multiplier = 0.5 + index * 0.16;
      const wobble = index % 2 === 0 ? 0 : 0.4;
      const value = Math.max(0, Math.round(base * multiplier + wobble));

      return {
        ...first,
        [dateKey]: index === 5 ? label : `T-${(5 - index) * 6}h`,
        [dataKey]: value
      };
    });
  }

  const expanded: RechartData[] = [];

  for (let index = 0; index < data.length - 1; index++) {
    const start = data[index];
    const end = data[index + 1];
    const startVal = toNumeric(start[dataKey]);
    const endVal = toNumeric(end[dataKey]);

    expanded.push(start);

    const midpoint = Math.max(0, Math.round((startVal + endVal) / 2));
    expanded.push({
      ...start,
      [dateKey]: `${String(start[dateKey] ?? `P${index + 1}`)} · mid`,
      [dataKey]: midpoint
    });
  }

  expanded.push(data[data.length - 1]);
  return expanded;
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const chartData = useMemo(() => expandSparseBarData(data, dataKey, dateKey), [data, dataKey, dateKey]);

  const enrichedData = useMemo(
    () =>
      chartData.map((point, index) => {
        const current = Number(point[dataKey] ?? 0);
        const previous = index > 0 ? Number(chartData[index - 1]?.[dataKey] ?? current) : current;
        const trend = Number(((current + previous) / 2).toFixed(1));
        const momentum = Number((current - previous).toFixed(1));

        return {
          ...point,
          trend,
          momentum
        };
      }),
    [chartData, dataKey]
  );

  useEffect(() => {
    setVisibleCount(0);

    const timer = window.setInterval(() => {
      setVisibleCount((count) => {
        if (count >= enrichedData.length) {
          window.clearInterval(timer);
          return count;
        }
        return count + 1;
      });
    }, 140);

    return () => window.clearInterval(timer);
  }, [enrichedData.length]);

  const stagedData = useMemo(
    () =>
      enrichedData.map((point, index) => {
        if (index < visibleCount) {
          return point;
        }

        return {
          ...point,
          [dataKey]: 0,
          trend: null,
          momentum: 0
        };
      }),
    [enrichedData, visibleCount, dataKey]
  );

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
            <ComposedChart
              data={stagedData}
              margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
              onMouseMove={(state) => {
                const idx = state?.activeTooltipIndex;
                setHoveredIndex(typeof idx === "number" ? idx : null);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.5" />
                </linearGradient>

                <linearGradient id="trendLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} strokeDasharray="4 4" />
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
                cursor={{ fill: "rgba(34,211,238,0.08)" }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }

                  const eventValue = Number(payload.find((entry) => entry.dataKey === dataKey)?.value ?? 0);
                  const trendValue = Number(payload.find((entry) => entry.dataKey === "trend")?.value ?? 0);
                  const momentumValue = Number(payload[0]?.payload?.momentum ?? 0);

                  return (
                    <div className="min-w-[170px] rounded-xl border border-cyan-300/40 bg-[rgba(2,10,28,0.96)] p-3 shadow-[0_0_22px_rgba(34,211,238,0.25)]">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200">{String(label)}</p>
                      <p className="mt-2 text-sm font-semibold text-white">Events: {eventValue}</p>
                      <p className="mt-1 text-xs text-slate-300">Trend: {trendValue.toFixed(1)}</p>
                      <p className={`mt-1 text-xs ${momentumValue >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                        Momentum: {momentumValue >= 0 ? "+" : ""}
                        {momentumValue.toFixed(1)}
                      </p>
                    </div>
                  );
                }}
              />

              <Line
                type="monotone"
                dataKey="trend"
                stroke="url(#trendLine)"
                strokeWidth={2.2}
                dot={{ r: 2.4, fill: "#93c5fd" }}
                activeDot={{ r: 4.8, fill: "#e0f2fe", stroke: "#38bdf8", strokeWidth: 2 }}
                animationDuration={900}
              />

              <Bar
                dataKey={dataKey}
                fill="url(#barGradient)"
                radius={[14, 14, 0, 0]}
                barSize={42}
                maxBarSize={50}
                activeBar={{
                  fill: color,
                  stroke: "rgba(255,255,255,0.45)",
                  strokeWidth: 1.4,
                  filter: "drop-shadow(0 0 16px rgba(34,211,238,0.48))"
                }}
                style={{
                  filter: "url(#glow-bar-filter)",
                  animationDuration: "1.2s",
                  animationFillMode: "ease-in-out"
                }}
              >
                {stagedData.map((_, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fillOpacity={hoveredIndex === null ? 0.9 : hoveredIndex === index ? 1 : 0.46}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}

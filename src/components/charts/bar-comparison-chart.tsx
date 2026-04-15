"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type Chart,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { GlassCard } from "@/components/shared/glass-card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const glowBarPlugin = {
  id: "glowBarPlugin",
  beforeDatasetDraw(chart: Chart, args: { index: number }) {
    const dataset = chart.data.datasets[args.index];
    const color = (dataset.backgroundColor as string) ?? "#22d3ee";
    const ctx = chart.ctx;

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
  },
  afterDatasetDraw(chart: Chart) {
    chart.ctx.restore();
  }
};

ChartJS.register(glowBarPlugin);

export function BarComparisonChart({
  title,
  description,
  labels,
  datasets,
  dynamic = false,
  maxValue = 100
}: {
  title: string;
  description?: string;
  labels: string[];
  datasets: Array<{ label: string; data: number[]; color: string }>;
  dynamic?: boolean;
  maxValue?: number;
}) {
  const [barTick, setBarTick] = useState(0);

  useEffect(() => {
    if (!dynamic) {
      return;
    }

    const timer = window.setInterval(() => {
      setBarTick((tick) => tick + 1);
    }, 1600);

    return () => window.clearInterval(timer);
  }, [dynamic]);

  const preparedDatasets = useMemo(
    () =>
      datasets.map((dataset, datasetIndex) => {
        const animatedData = dynamic
          ? dataset.data.map((value, barIndex) => {
              // Add subtle wave animation to each bar
              const phase = barTick * 0.35 + barIndex * 0.25 + datasetIndex * 0.5;
              const wobble = Math.sin(phase) * 3.5; // 3.5 unit oscillation
              return Math.max(0, Math.min(maxValue, Number((value + wobble).toFixed(1))));
            })
          : dataset.data;

        return {
          label: dataset.label,
          data: animatedData,
          backgroundColor: dataset.color,
          borderRadius: 12,
          borderSkipped: false,
          hoverBackgroundColor: dataset.color.replace(/0\.\d+\)/, "1)"), // Increase alpha on hover
          hoverBorderRadius: 14
        };
      }),
    [datasets, dynamic, barTick, maxValue]
  );

  return (
    <GlassCard className="h-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{title}</p>
          {dynamic ? (
            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-100">
              Live Update
            </span>
          ) : null}
        </div>
        {description && <p className="text-sm text-slate-300">{description}</p>}
      </div>

      <div className="relative mt-5 rounded-[22px] border border-cyan-300/15 bg-slate-950/60 p-4">
        {dynamic ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-48 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.08),transparent)] bg-[length:300%_100%]" />
        ) : null}

        <Bar
          data={{
            labels,
            datasets: preparedDatasets
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: dynamic ? 1300 : 800,
              easing: "easeInOutQuad"
            },
            plugins: {
              legend: {
                labels: {
                  color: "#dbeafe",
                  font: {
                    family: "var(--font-space)",
                    size: 12,
                    weight: 500
                  },
                  padding: 16,
                  boxWidth: 16,
                  boxHeight: 10
                }
              },
              tooltip: {
                backgroundColor: "rgba(3,10,25,0.97)",
                borderColor: "rgba(0,212,255,0.4)",
                borderWidth: 1.5,
                titleColor: "#e0f2fe",
                bodyColor: "#dbeafe",
                titleFont: { size: 13, weight: "bold" },
                bodyFont: { size: 12 },
                padding: 12,
                displayColors: true,
                borderRadius: 8,
                callbacks: {
                  afterLabel(context) {
                    return `Value: ${context.parsed.y.toFixed(1)}`;
                  }
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: "#93c5fd",
                  font: { family: "var(--font-space)", size: 11 }
                },
                grid: {
                  color: "rgba(148,163,184,0.08)",
                  drawBorder: false
                }
              },
              y: {
                ticks: {
                  color: "#93c5fd",
                  font: { family: "var(--font-space)", size: 11 }
                },
                grid: {
                  color: "rgba(148,163,184,0.08)",
                  drawBorder: false
                },
                suggestedMax: maxValue,
                beginAtZero: true
              }
            }
          }}
          height={320}
        />
      </div>
    </GlassCard>
  );
}

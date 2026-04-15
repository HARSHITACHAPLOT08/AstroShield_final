"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type Chart,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import { GlassCard } from "@/components/shared/glass-card";
import { cn } from "@/lib/utils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const glowLinePlugin = {
  id: "glowLinePlugin",
  beforeDatasetDraw(chart: Chart, args: { index: number }) {
    const dataset = chart.data.datasets[args.index];
    const color = (dataset.borderColor as string) ?? "#22d3ee";
    const ctx = chart.ctx;

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  },
  afterDatasetDraw(chart: Chart) {
    chart.ctx.restore();
  }
};

ChartJS.register(glowLinePlugin);

export function LineSignalChart({
  title,
  labels,
  datasets,
  dynamic = false,
  showGrid = true
}: {
  title: string;
  labels: string[];
  datasets: Array<{ label: string; data: number[]; color: string }>;
  dynamic?: boolean;
  showGrid?: boolean;
}) {
  const [pulseTick, setPulseTick] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!dynamic) {
      return;
    }

    const timer = window.setInterval(() => {
      setPulseTick((tick) => tick + 1);
    }, 1200);

    return () => window.clearInterval(timer);
  }, [dynamic]);

  const preparedDatasets = useMemo(
    () =>
      datasets.map((dataset, datasetIndex) => {
        const liftedData = dynamic
          ? dataset.data.map((point, pointIndex) => {
              const phase = pulseTick * 0.45 + pointIndex * 0.32 + datasetIndex * 0.6;
              const offset = pointIndex === dataset.data.length - 1 ? Math.sin(phase) * 0.6 : Math.sin(phase) * 0.22;
              return Number((point + offset).toFixed(2));
            })
          : dataset.data;

        return {
          label: dataset.label,
          data: liftedData,
          borderColor: dataset.color,
          backgroundColor: `${dataset.color}1f`,
          fill: true,
          tension: 0.42,
          borderWidth: hoveredIndex === null ? 2.8 : datasetIndex === hoveredIndex ? 3.6 : 1.8,
          pointRadius: (context: { dataIndex: number }) =>
            context.dataIndex === liftedData.length - 1 ? (dynamic ? (pulseTick % 2 === 0 ? 5 : 3.2) : 3.4) : 2.2,
          pointHoverRadius: 7.5,
          pointBackgroundColor: dataset.color,
          pointBorderColor: "#dbeafe",
          pointBorderWidth: 1.5,
          pointHoverBorderWidth: 2.5,
          cubicInterpolationMode: "monotone" as const,
          segment: {
            borderDash: () => (hoveredIndex === null || hoveredIndex === datasetIndex ? [] : [4, 4])
          }
        };
      }),
    [datasets, dynamic, pulseTick, hoveredIndex]
  );

  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{title}</p>
        {dynamic ? (
          <span className="rounded-full border border-cyan-300/30 bg-cyan-400/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
            Live Signal
          </span>
        ) : null}
      </div>

      <div className="relative mt-6 h-[300px] overflow-hidden rounded-[18px] border border-cyan-300/10 bg-gradient-to-b from-white/[0.02] to-transparent"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {dynamic ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.1),transparent)] bg-[length:200%_100%]" />
        ) : null}

        <Line
          data={{
            labels,
            datasets: preparedDatasets
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: dynamic ? 1100 : 700,
              easing: "easeOutQuart"
            },
            onHover: (_, activeElements) => {
              if (activeElements.length > 0) {
                setHoveredIndex((activeElements[0] as unknown as { datasetIndex: number }).datasetIndex);
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: "#cbd5e1",
                  boxWidth: 38,
                  boxHeight: 12,
                  font: {
                    family: "var(--font-space)",
                    size: 12,
                    weight: "bold" as const
                  },
                  padding: 14,
                  usePointStyle: false
                }
              },
              tooltip: {
                backgroundColor: "rgba(3,10,25,0.98)",
                borderColor: "rgba(0,212,255,0.5)",
                borderWidth: 1.5,
                titleColor: "#e0f2fe",
                bodyColor: "#dbeafe",
                titleFont: { size: 12, weight: "bold" },
                bodyFont: { size: 11 },
                padding: 10,
                displayColors: true,
                cornerRadius: 8,
                animation: {
                  duration: 200
                }
              }
            },
            scales: {
              x: {
                grid: { color: "rgba(148,163,184,0.07)" },
                ticks: { color: "#94a3b8", font: { family: "var(--font-space)", size: 11 } }
              },
              y: {
                grid: { color: "rgba(148,163,184,0.07)" },
                ticks: { color: "#94a3b8", font: { family: "var(--font-space)", size: 11 } }
              }
            }
          }}
        />
      </div>

      <div className={cn("mt-4 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent", dynamic && "animate-pulse")} />
    </GlassCard>
  );
}

"use client";

import {
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function LineSignalChart({
  title,
  labels,
  datasets
}: {
  title: string;
  labels: string[];
  datasets: Array<{ label: string; data: number[]; color: string }>;
}) {
  return (
    <GlassCard className="h-full">
      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{title}</p>
      <div className="mt-6 h-[300px]">
        <Line
          data={{
            labels,
            datasets: datasets.map((dataset) => ({
              label: dataset.label,
              data: dataset.data,
              borderColor: dataset.color,
              backgroundColor: `${dataset.color}22`,
              fill: true,
              tension: 0.35,
              pointRadius: 2.5,
              pointHoverRadius: 4
            }))
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: "#cbd5e1" }
              }
            },
            scales: {
              x: {
                grid: { color: "rgba(148,163,184,0.08)" },
                ticks: { color: "#94a3b8" }
              },
              y: {
                grid: { color: "rgba(148,163,184,0.08)" },
                ticks: { color: "#94a3b8" }
              }
            }
          }}
        />
      </div>
    </GlassCard>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(0)}%`;
}

export function severityToTone(severity: string) {
  switch (severity.toLowerCase()) {
    case "emergency":
    case "critical":
      return "from-fuchsia-500/20 to-rose-500/20 border-fuchsia-400/40";
    case "alert":
    case "high":
      return "from-rose-500/20 to-orange-500/20 border-rose-400/40";
    case "warning":
    case "moderate":
      return "from-amber-500/20 to-yellow-500/20 border-amber-400/40";
    default:
      return "from-emerald-500/20 to-cyan-500/20 border-emerald-400/40";
  }
}

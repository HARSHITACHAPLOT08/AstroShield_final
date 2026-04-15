"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CountUpNumberProps = {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  compact?: boolean;
};

export function CountUpNumber({
  value,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  compact = false
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const from = previousValueRef.current;
    const to = value;

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(from + (to - from) * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        previousValueRef.current = to;
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [duration, value]);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: compact ? "compact" : "standard"
  }).format(displayValue);

  return (
    <span className={cn("font-display tabular-nums tracking-[0.04em]", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

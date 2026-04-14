"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { GlassCard } from "@/components/shared/glass-card";

export function ContributionBars({
  data
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    if (!ref.current) return;

    svg.selectAll("*").remove();

    const width = ref.current.clientWidth || 500;
    const height = 260;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "barGradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#22d3ee" },
        { offset: "60%", color: "#3b82f6" },
        { offset: "100%", color: "#ec4899" }
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    const x = d3.scaleLinear().domain([0, 1]).range([0, width - 160]);
    const y = d3.scaleBand().domain(data.map((d) => d.name)).range([20, height - 20]).padding(0.24);
    const group = svg.append("g").attr("transform", "translate(140,0)");

    group
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => y(d.name) ?? 0)
      .attr("rx", 12)
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("fill", "url(#barGradient)")
      .transition()
      .duration(900)
      .attr("width", (d) => x(d.value));

    svg
      .append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 0)
      .attr("y", (d) => (y(d.name) ?? 0) + y.bandwidth() / 2 + 4)
      .attr("fill", "#e2e8f0")
      .attr("font-size", 13)
      .text((d) => d.name);

    group
      .selectAll("value")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.value) + 10)
      .attr("y", (d) => (y(d.name) ?? 0) + y.bandwidth() / 2 + 4)
      .attr("fill", "#94a3b8")
      .attr("font-size", 12)
      .text((d) => `${Math.round(d.value * 100)}%`);
  }, [data]);

  return (
    <GlassCard>
      <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Explainable AI</p>
      <h3 className="mt-2 font-display text-2xl text-white">Key Prediction Drivers</h3>
      <svg ref={ref} className="mt-4 h-[260px] w-full" />
    </GlassCard>
  );
}

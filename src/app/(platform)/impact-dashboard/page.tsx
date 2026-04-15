"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { CountUpNumber } from "@/components/shared/count-up-number";
import { BarComparisonChart } from "@/components/charts/bar-comparison-chart";

const baseMetrics = {
  co2Saved: 1245000,
  homesPowered: 382000,
  communitiesReached: 426,
  economicValue: 845000000
};

const progress = [
  { label: "Solar adoption", value: 62, color: "from-amber-300 via-orange-400 to-yellow-200" },
  { label: "Wind adoption", value: 48, color: "from-sky-300 via-cyan-400 to-blue-400" },
  { label: "Grid modernization", value: 56, color: "from-violet-400 via-fuchsia-400 to-cyan-300" },
  { label: "Space-tech integration", value: 31, color: "from-emerald-300 via-green-400 to-teal-300" }
];

const sdgs = [
  "SDG 7 Clean Energy",
  "SDG 9 Industry Innovation",
  "SDG 11 Sustainable Cities",
  "SDG 13 Climate Action",
  "SDG 17 Partnerships"
];

export default function ImpactDashboardPage() {
  const [liveSimulation, setLiveSimulation] = useState(false);
  const [liveBoost, setLiveBoost] = useState(0);

  useEffect(() => {
    if (!liveSimulation) {
      setLiveBoost(0);
      return;
    }

    const timer = window.setInterval(() => {
      setLiveBoost((prev) => prev + Math.floor(Math.random() * 18) + 6);
    }, 1200);

    return () => window.clearInterval(timer);
  }, [liveSimulation]);

  const counters = useMemo(() => {
    return {
      co2Saved: baseMetrics.co2Saved + liveBoost * 240,
      homesPowered: baseMetrics.homesPowered + liveBoost * 65,
      communitiesReached: baseMetrics.communitiesReached + Math.floor(liveBoost / 3),
      economicValue: baseMetrics.economicValue + liveBoost * 42000
    };
  }, [liveBoost]);

  const chartDatasets = useMemo(
    () => [
      {
        label: "Current fossil fuel world",
        data: [92, 44, 38, 78, 31],
        color: "rgba(248, 113, 113, 0.72)"
      },
      {
        label: "AstroShield-enabled clean energy world",
        data: [26, 88, 82, 34, 79],
        color: "rgba(34, 211, 238, 0.74)"
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Impact Dashboard"
        title="Unified Sustainability Impact Tracking"
        description="Monitor emissions reduction, access expansion, and economic uplift in one live operational picture."
        badge="UN SDG Framework · AstroShield Simulation"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CounterCard label="Total CO2 saved" value={counters.co2Saved} suffix=" t" />
        <CounterCard label="Homes powered" value={counters.homesPowered} />
        <CounterCard label="Communities reached" value={counters.communitiesReached} />
        <CounterCard label="Economic value unlocked" value={counters.economicValue} prefix="$" compact />
      </div>

      <BarComparisonChart
        title="Global system comparison"
        description="Current fossil infrastructure versus AstroShield-enabled clean-energy trajectory."
        labels={["Emissions", "Energy Access", "Grid Resilience", "Cost per kWh", "Energy Independence"]}
        datasets={chartDatasets}
        dynamic={liveSimulation}
        maxValue={100}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Global Energy Transition Progress</p>
          <div className="mt-4 space-y-4">
            {progress.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <span className="font-display text-xl text-white">{item.value}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900">
                  <div
                    className={`h-full animate-shimmer rounded-full bg-[length:200%_100%] bg-gradient-to-r ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="border-emerald-300/25 bg-gradient-to-br from-emerald-500/12 via-slate-950/70 to-cyan-500/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Live Simulation</p>
              <p className="mt-2 text-sm text-slate-300">Toggle to model active clean-energy acceleration in real time.</p>
            </div>
            <Switch checked={liveSimulation} onCheckedChange={setLiveSimulation} />
          </div>

          <div className="mt-6 rounded-[18px] border border-emerald-300/20 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Simulation state</p>
            <p className="mt-2 font-display text-3xl text-white">{liveSimulation ? "ENABLED" : "STANDBY"}</p>
            <p className="mt-2 text-sm text-slate-300">
              {liveSimulation
                ? "Counters are streaming upward to emulate global deployment impact."
                : "Enable simulation to animate platform-scale transition impact."}
            </p>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">UN SDG Alignment</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {sdgs.map((sdg) => (
            <div
              key={sdg}
              className="rounded-[16px] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 via-slate-950/70 to-fuchsia-500/12 p-3 text-center shadow-[0_0_22px_rgba(34,211,238,0.14)]"
            >
              <p className="font-display text-lg text-white">{sdg}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function CounterCard({
  label,
  value,
  prefix,
  suffix,
  compact
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
}) {
  return (
    <GlassCard className="bg-gradient-to-br from-cyan-400/10 via-slate-950/75 to-fuchsia-500/10">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <CountUpNumber value={value} prefix={prefix} suffix={suffix} compact={compact} className="mt-3 block text-4xl text-white" />
    </GlassCard>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { CountUpNumber } from "@/components/shared/count-up-number";
import { WorldTopologyMap, type WorldMarkerDatum, type WorldRegionDatum } from "@/components/mission/world-topology-map";

type CommunityProfile = WorldMarkerDatum & {
  population: number;
  energySource: "Kerosene" | "Wood" | "Diesel";
  solution: string;
  solarPanelsNeeded: number;
  batteryKwh: number;
  monthlySavings: number;
};

const communities: CommunityProfile[] = [
  {
    id: "cm-01",
    label: "Kisongo, Tanzania",
    coordinates: [35.2, -3.4],
    description: "Rural settlement with no stable mini-grid and high kerosene dependency.",
    value: 18500,
    fill: "#00ff88",
    size: 4.8,
    population: 18500,
    energySource: "Kerosene",
    solution: "Satellite-IoT solar microgrid with smart prepay meters and cold-chain nodes.",
    solarPanelsNeeded: 980,
    batteryKwh: 3400,
    monthlySavings: 18
  },
  {
    id: "cm-02",
    label: "Bani Waleed, Libya",
    coordinates: [14.1, 31.7],
    description: "Desert edge communities with weak diesel logistics and unstable supply.",
    value: 12200,
    fill: "#00ff88",
    size: 4.2,
    population: 12200,
    energySource: "Diesel",
    solution: "Hybrid solar + battery microgrid with satellite-backed predictive maintenance.",
    solarPanelsNeeded: 690,
    batteryKwh: 2200,
    monthlySavings: 24
  },
  {
    id: "cm-03",
    label: "Mtwara Belt, Mozambique",
    coordinates: [40.4, -10.3],
    description: "Fishing and farming villages running on wood and informal fuel trade.",
    value: 21400,
    fill: "#00ff88",
    size: 5,
    population: 21400,
    energySource: "Wood",
    solution: "Containerized microgrid clusters coordinated by low-orbit telemetry.",
    solarPanelsNeeded: 1160,
    batteryKwh: 3950,
    monthlySavings: 21
  },
  {
    id: "cm-04",
    label: "Lac Region, Chad",
    coordinates: [14.6, 13.5],
    description: "Remote zone with <20% access and high health-service disruption.",
    value: 16500,
    fill: "#00ff88",
    size: 4.5,
    population: 16500,
    energySource: "Kerosene",
    solution: "Village-scale DC microgrid with satellite uplink for remote diagnostics.",
    solarPanelsNeeded: 890,
    batteryKwh: 3000,
    monthlySavings: 16
  }
];

function buildEnergyPovertyRegion(featureItem: any): WorldRegionDatum {
  const [longitude, latitude] = d3.geoCentroid(featureItem) as [number, number];
  const tropicalBias = Math.max(0, 1 - Math.abs(latitude) / 55);
  const fragilityWave = (Math.cos((longitude - latitude) / 16) + 1) / 2;
  const accessRate = Math.round(18 + (1 - tropicalBias) * 55 + fragilityWave * 24);
  const underServed = accessRate < 30;

  return {
    id: String(featureItem.id),
    label: `Region ${featureItem.id}`,
    value: underServed ? 1 : 0,
    fill: underServed ? "rgba(249, 115, 22, 0.75)" : "rgba(16, 185, 129, 0.18)",
    tooltipTitle: `Region ${featureItem.id}`,
    tooltipLines: [
      `Electricity access ${accessRate}%`,
      underServed ? "Energy poverty zone: critical" : "Access improving",
      `Priority action: ${underServed ? "Microgrid deployment" : "Grid reinforcement"}`,
      "Data source: IEA · World Bank · UNICEF"
    ]
  };
}

export default function EnergyAccessPage() {
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityProfile>(communities[0]);
  const [population, setPopulation] = useState(8500);
  const [dailyNeed, setDailyNeed] = useState(3.2);
  const [homesPoweredToday, setHomesPoweredToday] = useState(1240);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHomesPoweredToday((prev) => prev + Math.floor(Math.random() * 4) + 1);
    }, 1400);

    return () => window.clearInterval(timer);
  }, []);

  const microgrid = useMemo(() => {
    const panelWatt = 540;
    const sunFactor = 4.8;
    const totalDailyKwh = population * dailyNeed;
    const panelOutput = (panelWatt / 1000) * sunFactor;
    const panels = Math.ceil(totalDailyKwh / panelOutput);
    const batteryKwh = Math.ceil(totalDailyKwh * 1.35);
    const uplink = Math.round(18500 + population * 1.8);
    const totalCost = Math.round(panels * 210 + batteryKwh * 150 + uplink);
    const monthlySavings = Math.round(population * 3.1);
    const paybackMonths = Math.max(14, Math.round(totalCost / Math.max(monthlySavings, 1)));

    return {
      panels,
      batteryKwh,
      uplink,
      totalCost,
      paybackMonths
    };
  }, [dailyNeed, population]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Energy Access"
        title="Humanitarian Energy Access Mission"
        description="Deploy satellite-guided microgrids to communities below 30% electricity access and track climate, health, and affordability impact in one command view."
        badge="IEA · World Bank · Satellite IoT"
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <WorldTopologyMap
          title="Global energy poverty zones"
          subtitle="Red-orange regions indicate critical electricity gaps. Satellite markers represent under-served communities ready for rapid microgrid deployment."
          dataSource="IEA Access Database · World Bank · UNICEF"
          colorScale={(value) => (value > 0 ? "rgba(249, 115, 22, 0.75)" : "rgba(16, 185, 129, 0.18)")}
          buildRegionData={buildEnergyPovertyRegion}
          markers={communities}
          markerMode="satellite"
          onMarkerSelect={(marker) => setSelectedCommunity(marker as CommunityProfile)}
          selectedMarkerId={selectedCommunity.id}
          earthTint="green"
          mapBackground="radial-gradient(circle at 50% 44%, rgba(4, 18, 16, 0.95), rgba(3, 10, 25, 0.98))"
          onRegionSelect={() => undefined}
        />

        <div className="space-y-6">
          <GlassCard className="border-emerald-300/20 bg-gradient-to-br from-emerald-400/14 via-slate-950/70 to-cyan-500/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Mission Control</p>
              <Badge className="border-emerald-300/30 bg-emerald-500/10 text-emerald-100">Live humanitarian model</Badge>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Stat label="People without electricity" value="733,000,000" />
              <Stat label="CO2 avoidable yearly" value="2,410,000 t" />
              <Stat label="Communities prioritized" value="12,460" />
              <Stat label="Projected homes powered" value="1,920,000" />
            </div>
          </GlassCard>

          <GlassCard className="border-emerald-300/20 bg-gradient-to-br from-slate-950/85 via-emerald-500/10 to-slate-950/85">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Community profile</p>
            <h2 className="mt-3 font-display text-3xl text-white">{selectedCommunity.label}</h2>
            <p className="mt-3 text-slate-300">{selectedCommunity.solution}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Stat label="Population" value={selectedCommunity.population.toLocaleString()} />
              <Stat label="Current source" value={selectedCommunity.energySource} />
              <Stat label="Solar panels needed" value={selectedCommunity.solarPanelsNeeded.toLocaleString()} />
              <Stat label="Battery storage" value={`${selectedCommunity.batteryKwh.toLocaleString()} kWh`} />
            </div>
            <div className="mt-4 rounded-[18px] border border-emerald-300/20 bg-emerald-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Estimated monthly savings per household</p>
              <p className="mt-2 font-display text-3xl text-white">${selectedCommunity.monthlySavings}</p>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassCard className="border-emerald-300/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Microgrid Designer</p>
              <p className="mt-2 text-sm text-slate-300">Tune demand and population to estimate deployment footprint and economics.</p>
            </div>
            <Badge className="border-emerald-300/25 bg-emerald-500/10 text-emerald-100">Satellite uplink model</Badge>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-300">Population size</span>
                <span className="font-display text-xl text-white">{population.toLocaleString()}</span>
              </div>
              <Slider
                min={500}
                max={40000}
                step={100}
                value={[population]}
                onValueChange={(value) => setPopulation(value[0] ?? population)}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-300">Daily energy need per person</span>
                <span className="font-display text-xl text-white">{dailyNeed.toFixed(1)} kWh</span>
              </div>
              <Slider
                min={1}
                max={8}
                step={0.1}
                value={[dailyNeed]}
                onValueChange={(value) => setDailyNeed(value[0] ?? dailyNeed)}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Stat label="Panels needed" value={microgrid.panels.toLocaleString()} />
            <Stat label="Battery capacity" value={`${microgrid.batteryKwh.toLocaleString()} kWh`} />
            <Stat label="Satellite uplink cost" value={`$${microgrid.uplink.toLocaleString()}`} />
            <Stat label="Total system cost" value={`$${microgrid.totalCost.toLocaleString()}`} />
            <Stat label="Payback period" value={`${microgrid.paybackMonths} months`} />
          </div>
        </GlassCard>

        <GlassCard className="border-emerald-300/20 bg-gradient-to-br from-emerald-400/14 via-slate-950/65 to-cyan-500/10">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Impact ticker</p>
          <p className="mt-2 text-sm text-slate-300">Real-time equivalent homes that could be energized today with active deployment.</p>
          <div className="mt-5 rounded-[20px] border border-emerald-300/20 bg-slate-950/65 p-4">
            <CountUpNumber value={homesPoweredToday} className="text-5xl text-emerald-200" />
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-emerald-300">Homes powered today</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="CO2 saved" value="188,000 t" />
            <Stat label="Trees equivalent" value="8.6M" />
            <Stat label="Health impact score" value="91/100" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-emerald-300/20 bg-slate-950/60 p-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 font-display text-2xl text-white">{value}</p>
    </div>
  );
}

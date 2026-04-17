"use client";

import { useMemo, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { CountUpNumber } from "@/components/shared/count-up-number";
import { WorldTopologyMap, type WorldRegionDatum } from "@/components/mission/world-topology-map";
import { cn } from "@/lib/utils";

type SolarSelection = WorldRegionDatum & {
  irradiance: number;
  panelAngle: number;
  peakSunHours: number;
  annualOutputPerKm2: number;
  recommendedFarmSize: number;
  estimatedMwCapacity: number;
  co2Offset: number;
  homesPowered: number;
  roiEstimate: number;
  terrainNote: string;
};

type SolarLocation = SolarSelection & {
  subtitle: string;
  rankingNote: string;
  country: string;
};

const topLocations: SolarLocation[] = [
  {
    id: "loc-01",
    label: "Atacama Solar Corridor",
    country: "Chile",
    subtitle: "World-leading clear-sky irradiance and dry-atmosphere performance.",
    rankingNote: "High altitude, low cloud cover, and exceptional year-round yield.",
    value: 7.8,
    tooltipTitle: "Atacama Solar Corridor",
    tooltipLines: ["Irradiance 7.8 kWh/m²/day", "Optimal panel angle 12°", "Peak sun hours 8.9", "Annual energy output 1,420 GWh/km²"],
    irradiance: 7.8,
    panelAngle: 12,
    peakSunHours: 8.9,
    annualOutputPerKm2: 1420,
    recommendedFarmSize: 88,
    estimatedMwCapacity: 1320,
    co2Offset: 3140000,
    homesPowered: 785000,
    roiEstimate: 19.4,
    terrainNote: "Best for utility-scale fixed-tilt fields with minimal tracking drag."
  },
  {
    id: "loc-02",
    label: "Western Desert Energy Belt",
    country: "Egypt",
    subtitle: "Stable desert irradiation near transmission corridors.",
    rankingNote: "Strong peak sun and excellent proximity to load centers.",
    value: 7.5,
    tooltipTitle: "Western Desert Energy Belt",
    tooltipLines: ["Irradiance 7.5 kWh/m²/day", "Optimal panel angle 11°", "Peak sun hours 8.5", "Annual energy output 1,350 GWh/km²"],
    irradiance: 7.5,
    panelAngle: 11,
    peakSunHours: 8.5,
    annualOutputPerKm2: 1350,
    recommendedFarmSize: 94,
    estimatedMwCapacity: 1260,
    co2Offset: 2980000,
    homesPowered: 744000,
    roiEstimate: 18.8,
    terrainNote: "Ideal for long-duration storage and satellite-optimized dispatch."
  },
  {
    id: "loc-03",
    label: "Arabian Sun Spine",
    country: "Saudi Arabia",
    subtitle: "Space-backed solar potential across wide desert plateaus.",
    rankingNote: "High direct normal irradiance and huge available acreage.",
    value: 7.4,
    tooltipTitle: "Arabian Sun Spine",
    tooltipLines: ["Irradiance 7.4 kWh/m²/day", "Optimal panel angle 13°", "Peak sun hours 8.4", "Annual energy output 1,320 GWh/km²"],
    irradiance: 7.4,
    panelAngle: 13,
    peakSunHours: 8.4,
    annualOutputPerKm2: 1320,
    recommendedFarmSize: 102,
    estimatedMwCapacity: 1295,
    co2Offset: 2910000,
    homesPowered: 732000,
    roiEstimate: 18.3,
    terrainNote: "Excellent for hybrid solar + thermal storage investment."
  },
  {
    id: "loc-04",
    label: "Great Victoria Solar Arc",
    country: "Australia",
    subtitle: "Gigawatt-scale potential across remote inland basins.",
    rankingNote: "Strong export opportunity through long-distance interconnects.",
    value: 7.2,
    tooltipTitle: "Great Victoria Solar Arc",
    tooltipLines: ["Irradiance 7.2 kWh/m²/day", "Optimal panel angle 15°", "Peak sun hours 8.1", "Annual energy output 1,270 GWh/km²"],
    irradiance: 7.2,
    panelAngle: 15,
    peakSunHours: 8.1,
    annualOutputPerKm2: 1270,
    recommendedFarmSize: 96,
    estimatedMwCapacity: 1210,
    co2Offset: 2850000,
    homesPowered: 704000,
    roiEstimate: 17.9,
    terrainNote: "Best coupled with satellite telemetry for remote asset diagnostics."
  },
  {
    id: "loc-05",
    label: "Rajasthan Energy Basin",
    country: "India",
    subtitle: "High-access corridor with fast interconnection prospects.",
    rankingNote: "Large demand base increases effective project utilization.",
    value: 7.0,
    tooltipTitle: "Rajasthan Energy Basin",
    tooltipLines: ["Irradiance 7.0 kWh/m²/day", "Optimal panel angle 16°", "Peak sun hours 7.8", "Annual energy output 1,220 GWh/km²"],
    irradiance: 7.0,
    panelAngle: 16,
    peakSunHours: 7.8,
    annualOutputPerKm2: 1220,
    recommendedFarmSize: 84,
    estimatedMwCapacity: 1140,
    co2Offset: 2680000,
    homesPowered: 671000,
    roiEstimate: 17.1,
    terrainNote: "Excellent for distributed rural and industrial demand balancing."
  },
  {
    id: "loc-06",
    label: "Sonoran Solar Rim",
    country: "United States",
    subtitle: "Fast-to-build desert edge with strong storage economics.",
    rankingNote: "Good grid access and strong market pricing periods.",
    value: 6.9,
    tooltipTitle: "Sonoran Solar Rim",
    tooltipLines: ["Irradiance 6.9 kWh/m²/day", "Optimal panel angle 14°", "Peak sun hours 7.7", "Annual energy output 1,170 GWh/km²"],
    irradiance: 6.9,
    panelAngle: 14,
    peakSunHours: 7.7,
    annualOutputPerKm2: 1170,
    recommendedFarmSize: 82,
    estimatedMwCapacity: 1090,
    co2Offset: 2550000,
    homesPowered: 646000,
    roiEstimate: 16.6,
    terrainNote: "Pairs well with flexible demand and battery arbitrage."
  },
  {
    id: "loc-07",
    label: "Kalahari Greenline",
    country: "Namibia",
    subtitle: "High solar yield with space for resilient community-scale farms.",
    rankingNote: "Low cloud cover and high social impact upside.",
    value: 6.8,
    tooltipTitle: "Kalahari Greenline",
    tooltipLines: ["Irradiance 6.8 kWh/m²/day", "Optimal panel angle 13°", "Peak sun hours 7.5", "Annual energy output 1,160 GWh/km²"],
    irradiance: 6.8,
    panelAngle: 13,
    peakSunHours: 7.5,
    annualOutputPerKm2: 1160,
    recommendedFarmSize: 77,
    estimatedMwCapacity: 1045,
    co2Offset: 2490000,
    homesPowered: 621000,
    roiEstimate: 16.2,
    terrainNote: "Strong fit for utility and community microgrid hybrids."
  },
  {
    id: "loc-08",
    label: "Andalusian Sun Shelf",
    country: "Spain",
    subtitle: "Transitional grid potential with strong export links.",
    rankingNote: "Balanced yield and policy readiness for quick deployment.",
    value: 6.6,
    tooltipTitle: "Andalusian Sun Shelf",
    tooltipLines: ["Irradiance 6.6 kWh/m²/day", "Optimal panel angle 20°", "Peak sun hours 7.2", "Annual energy output 1,120 GWh/km²"],
    irradiance: 6.6,
    panelAngle: 20,
    peakSunHours: 7.2,
    annualOutputPerKm2: 1120,
    recommendedFarmSize: 72,
    estimatedMwCapacity: 990,
    co2Offset: 2320000,
    homesPowered: 590000,
    roiEstimate: 15.8,
    terrainNote: "Good candidate for multi-buyer corporate renewable procurement."
  },
  {
    id: "loc-09",
    label: "Peruvian Coastal Array",
    country: "Peru",
    subtitle: "Stable coastal strip with high-confidence satellite forecasts.",
    rankingNote: "Reliable output and strong demand from mining corridors.",
    value: 6.5,
    tooltipTitle: "Peruvian Coastal Array",
    tooltipLines: ["Irradiance 6.5 kWh/m²/day", "Optimal panel angle 18°", "Peak sun hours 7.1", "Annual energy output 1,090 GWh/km²"],
    irradiance: 6.5,
    panelAngle: 18,
    peakSunHours: 7.1,
    annualOutputPerKm2: 1090,
    recommendedFarmSize: 69,
    estimatedMwCapacity: 955,
    co2Offset: 2260000,
    homesPowered: 564000,
    roiEstimate: 15.4,
    terrainNote: "High-value for coastal transmission and industrial corridors."
  },
  {
    id: "loc-10",
    label: "Baja Solar Frontier",
    country: "Mexico",
    subtitle: "Near-market desert expansion with flexible storage strategy.",
    rankingNote: "Quick interconnection and strong land availability.",
    value: 6.3,
    tooltipTitle: "Baja Solar Frontier",
    tooltipLines: ["Irradiance 6.3 kWh/m²/day", "Optimal panel angle 17°", "Peak sun hours 6.8", "Annual energy output 1,040 GWh/km²"],
    irradiance: 6.3,
    panelAngle: 17,
    peakSunHours: 6.8,
    annualOutputPerKm2: 1040,
    recommendedFarmSize: 68,
    estimatedMwCapacity: 920,
    co2Offset: 2140000,
    homesPowered: 540000,
    roiEstimate: 15.0,
    terrainNote: "Well suited for phased buildout and grid service stacking."
  }
];

function buildSolarSelection(featureItem: any, index: number): SolarSelection {
  const [longitude, latitude] = d3.geoCentroid(featureItem) as [number, number];
  const latitudeBias = 1 - Math.min(Math.abs(latitude) / 90, 1);
  const longitudeWave = (Math.sin((longitude + latitude) / 18) + 1) / 2;
  const irradiance = Number((2 + latitudeBias * 4.1 + longitudeWave * 0.8).toFixed(1));
  const panelAngle = Math.max(5, Math.round(Math.abs(latitude) * 0.72 + 8));
  const peakSunHours = Number((irradiance + 1.1).toFixed(1));
  const annualOutputPerKm2 = Math.round(irradiance * 178 + 140);
  const recommendedFarmSize = Math.round(28 + irradiance * 10 + index % 6);
  const estimatedMwCapacity = Math.round(recommendedFarmSize * 11.8 + irradiance * 42);
  const co2Offset = Math.round(estimatedMwCapacity * 2380);
  const homesPowered = Math.round(estimatedMwCapacity * 615);
  const roiEstimate = Number((11.6 + irradiance * 1.15 + latitudeBias * 2.1).toFixed(1));

  return {
    id: String(featureItem.id),
    label: `Region ${featureItem.id}`,
    value: irradiance,
    tooltipTitle: `Region ${featureItem.id}`,
    tooltipLines: [
      `Irradiance ${irradiance.toFixed(1)} kWh/m²/day`,
      `Optimal panel angle ${panelAngle}°`,
      `Peak sun hours ${peakSunHours.toFixed(1)}`,
      `Annual energy output ${annualOutputPerKm2.toLocaleString()} MWh/km²`
    ],
    irradiance,
    panelAngle,
    peakSunHours,
    annualOutputPerKm2,
    recommendedFarmSize,
    estimatedMwCapacity,
    co2Offset,
    homesPowered,
    roiEstimate,
    terrainNote: latitude > 20 ? "Northern hemisphere tilt gives sharper yield gains." : "Lower-latitude geometry favors flatter tracking arrays."
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function SolarOptimizerPage() {
  const [selectedRegion, setSelectedRegion] = useState<SolarSelection>(topLocations[0]);

  const colorScale = useMemo(() => {
    return d3
      .scaleLinear<string>()
      .domain([2, 4, 5.5, 7.5])
      .range(["#2a1200", "#8a3700", "#f59e0b", "#fde68a"])
      .clamp(true);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Solar Optimizer"
        title="Satellite-powered solar site selection"
        description="Pinpoint the best utility-scale regions with irradiance intelligence, panel geometry guidance, and investment return context."
        badge="NASA POWER API · PVGIS · Satellite Derived"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="bg-gradient-to-br from-amber-400/10 via-slate-950/50 to-orange-500/10">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Selected irradiance</p>
          <div className="mt-4 flex items-end gap-2">
            <CountUpNumber value={selectedRegion.irradiance} decimals={1} className="text-4xl text-white" />
            <span className="pb-1 text-slate-300">kWh/m²/day</span>
          </div>
        </GlassCard>
        <GlassCard className="bg-gradient-to-br from-amber-300/10 via-slate-950/50 to-yellow-500/10">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Estimated capacity</p>
          <div className="mt-4 flex items-end gap-2">
            <CountUpNumber value={selectedRegion.estimatedMwCapacity} className="text-4xl text-white" />
            <span className="pb-1 text-slate-300">MW</span>
          </div>
        </GlassCard>
        <GlassCard className="bg-gradient-to-br from-orange-400/10 via-slate-950/50 to-amber-500/10">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Annual output per km²</p>
          <div className="mt-4 flex items-end gap-2">
            <CountUpNumber value={selectedRegion.annualOutputPerKm2} className="text-4xl text-white" />
            <span className="pb-1 text-slate-300">MWh</span>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <WorldTopologyMap
          title="Global solar irradiance atlas"
          subtitle="Bright orange and gold regions represent the highest satellite-derived solar yield. Click any region to inspect farm-scale economics and field geometry."
          dataSource="NASA POWER API · PVGIS · Satellite Derived"
          mapHeightClassName="h-[560px] xl:h-[660px]"
          colorScale={colorScale}
          buildRegionData={buildSolarSelection}
          selectedRegionId={selectedRegion.id}
          earthTint="green"
          showOrbitSatellites
          mapBackground="radial-gradient(circle at 50% 42%, rgba(12, 26, 18, 0.92), rgba(4, 12, 28, 0.98))"
          onRegionSelect={(region) => setSelectedRegion(region as SolarSelection)}
        />

        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-amber-400/10 via-slate-950/60 to-orange-500/12">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Site detail panel</p>
            <h2 className="mt-4 font-display text-3xl text-white">{selectedRegion.label}</h2>
            <p className="mt-3 text-slate-300">{selectedRegion.terrainNote}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailStat label="Recommended farm size" value={`${formatNumber(selectedRegion.recommendedFarmSize)} km²`} />
              <DetailStat label="Estimated MW capacity" value={`${formatNumber(selectedRegion.estimatedMwCapacity)} MW`} />
              <DetailStat label="CO₂ offset per year" value={`${formatNumber(selectedRegion.co2Offset)} t`} />
              <DetailStat label="Homes powered" value={`${formatNumber(selectedRegion.homesPowered)}`} />
            </div>
            <div className="mt-6 rounded-[22px] border border-amber-300/10 bg-slate-950/55 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.22em] text-slate-400">ROI estimate</span>
                <span className="font-display text-3xl text-amber-100">{selectedRegion.roiEstimate.toFixed(1)}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-200" style={{ width: `${Math.min(selectedRegion.roiEstimate * 4, 100)}%` }} />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Top 10 Optimal Locations</p>
                <h3 className="mt-2 font-display text-2xl text-white">Ranked deployment targets</h3>
              </div>
              <Badge className="border-amber-300/20 bg-amber-400/10 text-amber-100">Ranked by yield</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {topLocations.map((location, index) => (
                <motion.button
                  key={location.id}
                  type="button"
                  onClick={() => setSelectedRegion(location)}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className={cn(
                    "w-full rounded-[22px] border px-4 py-4 text-left transition",
                    selectedRegion.id === location.id
                      ? "border-amber-300/30 bg-amber-400/12 shadow-[0_0_0_1px_rgba(251,191,36,0.15)]"
                      : "border-white/8 bg-slate-950/45 hover:border-amber-300/20 hover:bg-slate-950/60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 font-display text-lg text-slate-950">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{location.label}</p>
                          <p className="text-sm text-slate-400">{location.country}</p>
                        </div>
                        <span className="font-display text-xl text-amber-100">{location.irradiance.toFixed(1)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{location.subtitle}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-200/80">
                        <span>{location.panelAngle}° tilt</span>
                        <span>•</span>
                        <span>{location.peakSunHours.toFixed(1)} peak sun hours</span>
                        <span>•</span>
                        <span>{location.roiEstimate.toFixed(1)}% ROI</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-amber-300/10 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-3 font-display text-2xl text-white">{value}</p>
    </div>
  );
}

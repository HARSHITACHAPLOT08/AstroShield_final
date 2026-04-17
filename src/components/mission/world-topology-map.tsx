"use client";

import { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type WorldGeoFeature = Feature<Geometry, GeoJsonProperties>;

function isFeatureCollection(value: unknown): value is FeatureCollection<Geometry, GeoJsonProperties> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { type?: string; features?: unknown };
  return candidate.type === "FeatureCollection" && Array.isArray(candidate.features);
}

export type WorldRegionDatum = {
  id: string;
  label: string;
  value: number;
  tooltipTitle?: string;
  tooltipLines: string[];
  fill?: string;
};

export type WorldMarkerDatum = {
  id: string;
  label: string;
  coordinates: [number, number];
  description?: string;
  value?: number;
  fill?: string;
  size?: number;
};

type WorldTopologyMapProps = {
  title: string;
  subtitle?: string;
  dataSource?: string;
  className?: string;
  mapHeightClassName?: string;
  colorScale: (value: number) => string;
  buildRegionData: (featureItem: WorldGeoFeature, index: number) => WorldRegionDatum;
  onRegionSelect?: (region: WorldRegionDatum) => void;
  selectedRegionId?: string | null;
  markers?: WorldMarkerDatum[];
  onMarkerSelect?: (marker: WorldMarkerDatum) => void;
  selectedMarkerId?: string | null;
  markerMode?: "pulse" | "dot" | "satellite";
  mapBackground?: string;
  earthTint?: "cyan" | "green";
  showOrbitSatellites?: boolean;
};

const WORLD_TOPOLOGY_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function WorldTopologyMap({
  title,
  subtitle,
  dataSource,
  className,
  mapHeightClassName = "h-[540px]",
  colorScale,
  buildRegionData,
  onRegionSelect,
  selectedRegionId,
  markers = [],
  onMarkerSelect,
  selectedMarkerId,
  markerMode = "pulse",
  mapBackground = "radial-gradient(circle at 48% 42%, rgba(10, 45, 68, 0.95), rgba(3, 13, 34, 0.98))",
  earthTint = "green",
  showOrbitSatellites = true
}: WorldTopologyMapProps) {
  const [topologyData, setTopologyData] = useState<Topology | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<WorldRegionDatum | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<WorldMarkerDatum | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [enlarged, setEnlarged] = useState(false);

  const activeMapHeightClassName = enlarged ? "h-[680px] xl:h-[760px]" : mapHeightClassName;

  useEffect(() => {
    let mounted = true;

    fetch(WORLD_TOPOLOGY_URL)
      .then((response) => response.json())
      .then((json) => {
        if (mounted) {
          setTopologyData(json);
        }
      })
      .catch(() => {
        if (mounted) {
          setTopologyData(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const worldFeatures = useMemo(() => {
    if (!topologyData) {
      return [] as WorldGeoFeature[];
    }

    const result: unknown = feature(topologyData, topologyData.objects.countries as any);
    if (isFeatureCollection(result)) {
      return result.features;
    }

    return [] as WorldGeoFeature[];
  }, [topologyData]);

  const projection = useMemo(() => {
    if (!worldFeatures.length) {
      return d3.geoNaturalEarth1().scale(190).translate([600, 310]);
    }

    return d3.geoNaturalEarth1().fitSize([1200, 620], {
      type: "FeatureCollection",
      features: worldFeatures
    } as FeatureCollection<Geometry, GeoJsonProperties>);
  }, [worldFeatures]);

  const path = useMemo(() => d3.geoPath(projection), [projection]);
  const spherePath = useMemo(() => path({ type: "Sphere" }) ?? undefined, [path]);
  const graticule = useMemo(() => d3.geoGraticule10(), []);
  const regionData = useMemo(
    () => worldFeatures.map((featureItem, index) => ({ featureItem, datum: buildRegionData(featureItem, index) })),
    [buildRegionData, worldFeatures]
  );

  return (
    <div className={cn("glass-panel relative overflow-hidden rounded-[32px] p-4", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/90">{title}</p>
          {subtitle ? <p className="mt-2 max-w-3xl text-sm text-slate-300">{subtitle}</p> : null}
        </div>
        {dataSource ? <Badge className="border-cyan-300/20 bg-cyan-400/10 text-cyan-100">{dataSource}</Badge> : null}
      </div>

      <div
        className="group relative overflow-hidden rounded-[28px] border border-cyan-300/10 transition duration-300 hover:border-cyan-300/30 hover:shadow-[0_0_36px_rgba(34,211,238,0.2)]"
        style={{ background: mapBackground }}
        onMouseLeave={() => {
          setHoveredRegion(null);
          setHoveredMarker(null);
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_65%_20%,rgba(34,211,238,0.12),transparent_42%)]" />
        <button
          type="button"
          onClick={() => setEnlarged((value) => !value)}
          className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-cyan-300/28 bg-slate-950/72 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-cyan-100 transition hover:border-cyan-300/50 hover:bg-slate-950/85"
        >
          {enlarged ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          {enlarged ? "Minimize" : "Enlarge"}
        </button>

        {topologyData ? (
          <svg viewBox="0 0 1200 620" className={cn("w-full transition-[height] duration-300 ease-out", activeMapHeightClassName)}>
            <defs>
              <radialGradient id="map-ocean-earth" cx="42%" cy="38%" r="66%">
                <stop offset="0%" stopColor="rgba(38, 105, 140, 0.96)" />
                <stop offset="42%" stopColor="rgba(15, 69, 96, 0.96)" />
                <stop offset="100%" stopColor="rgba(2, 18, 36, 0.99)" />
              </radialGradient>
              <radialGradient id="map-atmosphere" cx="50%" cy="42%" r="68%">
                <stop offset="65%" stopColor="rgba(45, 212, 191, 0)" />
                <stop offset="100%" stopColor={earthTint === "green" ? "rgba(0,255,136,0.34)" : "rgba(34,211,238,0.28)"} />
              </radialGradient>
              <radialGradient id="map-specular" cx="34%" cy="26%" r="28%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.34)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <filter id="map-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <clipPath id="map-earth-clip">
                {spherePath ? <path d={spherePath} /> : null}
              </clipPath>
            </defs>

            <rect x="0" y="0" width="1200" height="620" fill="transparent" />
            {spherePath ? (
              <>
                <path d={spherePath} fill="url(#map-ocean-earth)" stroke="rgba(0,255,136,0.3)" strokeWidth="1.2" />
                <path d={spherePath} fill="url(#map-atmosphere)" opacity="0.8" />
                <path d={spherePath} fill="url(#map-specular)" opacity="0.7" />
              </>
            ) : null}

            <g clipPath="url(#map-earth-clip)">
              <path
                d={path(graticule) ?? undefined}
                fill="none"
                stroke={earthTint === "green" ? "rgba(16,185,129,0.2)" : "rgba(148,163,184,0.16)"}
                strokeWidth="0.7"
              />

              {regionData.map(({ featureItem, datum }) => {
                const active = selectedRegionId === datum.id;
                const fillColor = datum.fill ?? colorScale(datum.value);

                return (
                  <path
                    key={datum.id}
                    d={path(featureItem) ?? undefined}
                    fill={fillColor}
                    stroke={active ? "rgba(240,253,244,0.95)" : "rgba(186,230,253,0.36)"}
                    strokeWidth={active ? 1.5 : 0.75}
                    opacity={active || hoveredRegion?.id === datum.id ? 1 : 0.92}
                    filter={active ? "url(#map-soft-glow)" : undefined}
                    style={{ transition: "opacity 180ms ease, transform 180ms ease, filter 180ms ease" }}
                    onMouseMove={(event) => {
                      setHoveredRegion(datum);
                      setHoveredMarker(null);
                      setPointer({ x: event.clientX, y: event.clientY });
                    }}
                    onClick={() => onRegionSelect?.(datum)}
                    className="cursor-pointer"
                  />
                );
              })}
            </g>

            {showOrbitSatellites ? (
              <g opacity="0.72">
                <ellipse cx="600" cy="310" rx="476" ry="230" fill="none" stroke="rgba(56,189,248,0.24)" strokeWidth="1" strokeDasharray="6 7" />
                <ellipse cx="600" cy="310" rx="518" ry="255" fill="none" stroke="rgba(0,255,136,0.2)" strokeWidth="1" strokeDasharray="8 9" />
                <g transform="translate(1060,312)" className="animate-[float_8s_ease-in-out_infinite]">
                  <rect x="-8" y="-4" width="16" height="8" rx="2" fill="rgba(191,219,254,0.95)" />
                  <rect x="-20" y="-3" width="10" height="6" rx="1" fill="rgba(34,211,238,0.7)" />
                  <rect x="10" y="-3" width="10" height="6" rx="1" fill="rgba(34,211,238,0.7)" />
                </g>
                <g transform="translate(150,292)" className="animate-[float_10s_ease-in-out_infinite]">
                  <rect x="-8" y="-4" width="16" height="8" rx="2" fill="rgba(191,219,254,0.95)" />
                  <rect x="-20" y="-3" width="10" height="6" rx="1" fill="rgba(16,185,129,0.74)" />
                  <rect x="10" y="-3" width="10" height="6" rx="1" fill="rgba(16,185,129,0.74)" />
                </g>
              </g>
            ) : null}

            {markers.map((marker) => {
              const projected = projection(marker.coordinates);
              if (!projected) {
                return null;
              }

              const [x, y] = projected;
              const active = selectedMarkerId === marker.id;
              const dotSize = marker.size ?? 5.5;
              const pulseFill = marker.fill ?? "#00ff88";

              return (
                <g
                  key={marker.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer"
                  onMouseMove={(event) => {
                    setHoveredMarker(marker);
                    setHoveredRegion(null);
                    setPointer({ x: event.clientX, y: event.clientY });
                  }}
                  onClick={() => onMarkerSelect?.(marker)}
                >
                  {markerMode !== "satellite" ? (
                    <>
                      <circle r={dotSize * 2.8} fill={pulseFill} opacity={0.14} className="animate-pulse" />
                      <circle r={dotSize * 1.9} fill={pulseFill} opacity={0.28} className="animate-pulse" />
                    </>
                  ) : null}
                  {markerMode === "satellite" ? (
                    <g filter="url(#map-soft-glow)">
                      <ellipse rx={dotSize * 3.2} ry={dotSize * 2.1} fill="rgba(0,255,136,0.14)" className="animate-pulse" />
                      <rect
                        x={-dotSize * 0.9}
                        y={-dotSize * 0.52}
                        width={dotSize * 1.8}
                        height={dotSize * 1.04}
                        rx={dotSize * 0.22}
                        fill={active ? "#f0fdf4" : "#dbeafe"}
                        stroke="rgba(15,23,42,0.75)"
                        strokeWidth="0.7"
                      />
                      <rect
                        x={-dotSize * 2.3}
                        y={-dotSize * 0.42}
                        width={dotSize * 1.1}
                        height={dotSize * 0.84}
                        rx={dotSize * 0.16}
                        fill={pulseFill}
                        opacity={active ? 1 : 0.85}
                      />
                      <rect
                        x={dotSize * 1.2}
                        y={-dotSize * 0.42}
                        width={dotSize * 1.1}
                        height={dotSize * 0.84}
                        rx={dotSize * 0.16}
                        fill={pulseFill}
                        opacity={active ? 1 : 0.85}
                      />
                      <circle cx={0} cy={0} r={dotSize * 0.23} fill="rgba(2,6,23,0.8)" />
                    </g>
                  ) : (
                    <circle
                      r={dotSize}
                      fill={pulseFill}
                      stroke={active ? "#ffffff" : "rgba(255,255,255,0.65)"}
                      strokeWidth={active ? 2.2 : 1.2}
                      filter="url(#map-soft-glow)"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        ) : (
          <div className={cn("flex items-center justify-center text-sm uppercase tracking-[0.24em] text-slate-400 transition-[height] duration-300 ease-out", activeMapHeightClassName)}>
            Loading world topology...
          </div>
        )}

        {(hoveredRegion || hoveredMarker) && (
          <div
            className="pointer-events-none fixed z-50 w-[310px] rounded-[20px] border border-cyan-300/40 bg-[rgba(3,10,25,0.97)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            style={{ left: pointer.x, top: pointer.y - 8 }}
          >
            {hoveredRegion ? (
              <>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{hoveredRegion.tooltipTitle ?? hoveredRegion.label}</p>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  {hoveredRegion.tooltipLines.map((line) => (
                    <p key={line} className="leading-6">
                      {line}
                    </p>
                  ))}
                </div>
              </>
            ) : null}
            {hoveredMarker ? (
              <>
                <p className="text-xs uppercase tracking-[0.24em] text-[#00ff88]">{hoveredMarker.label}</p>
                <p className="mt-3 text-sm leading-6 text-slate-200">{hoveredMarker.description ?? "Community signal hotspot"}</p>
                {typeof hoveredMarker.value === "number" ? (
                  <p className="mt-3 font-display text-2xl text-white">{hoveredMarker.value.toLocaleString()}</p>
                ) : null}
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Fragment } from "react";
import { divIcon } from "leaflet";
import { Circle, MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import type { AviationRoute } from "@/types";

const routeColor: Record<AviationRoute["risk"], string> = {
  Low: "#22c55e",
  Moderate: "#f59e0b",
  High: "#ec4899"
};

function getRouteHeading(route: AviationRoute) {
  const end = route.coordinates[route.coordinates.length - 1];
  const prev = route.coordinates[route.coordinates.length - 2] ?? route.coordinates[0];

  const deltaLat = end[0] - prev[0];
  const deltaLng = end[1] - prev[1];
  return (Math.atan2(deltaLng, deltaLat) * 180) / Math.PI;
}

function getPlaneIcon(accent: string, heading: number) {
  return divIcon({
    className: "aviation-plane-marker-shell",
    html: `
      <div class="aviation-plane-marker-shell-inner" style="--route-accent:${accent}; --route-angle:${heading}deg;">
        <div class="aviation-plane-marker">
          <span class="aviation-plane-glyph" aria-hidden="true">✈</span>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function ZoneRings({
  center,
  outerRadius,
  midRadius,
  innerRadius,
  tone
}: {
  center: [number, number];
  outerRadius: number;
  midRadius: number;
  innerRadius: number;
  tone: "cyan" | "orange";
}) {
  return (
    <>
      <Circle
        center={center}
        radius={outerRadius}
        className={`aviation-zone aviation-zone--${tone} aviation-zone--outer`}
        pathOptions={{
          color: tone === "cyan" ? "#22d3ee" : "#fb923c",
          fillColor: tone === "cyan" ? "#22d3ee" : "#fb923c",
          fillOpacity: 0.04,
          weight: 2,
          opacity: 0.28
        }}
      />
      <Circle
        center={center}
        radius={midRadius}
        className={`aviation-zone aviation-zone--${tone} aviation-zone--mid`}
        pathOptions={{
          color: tone === "cyan" ? "#22d3ee" : "#fb923c",
          fillColor: tone === "cyan" ? "#22d3ee" : "#fb923c",
          fillOpacity: 0.1,
          weight: 3,
          opacity: 0.82
        }}
      />
      <Circle
        center={center}
        radius={innerRadius}
        className={`aviation-zone aviation-zone--${tone} aviation-zone--inner`}
        pathOptions={{
          color: tone === "cyan" ? "#22d3ee" : "#fb923c",
          fillColor: tone === "cyan" ? "#22d3ee" : "#fb923c",
          fillOpacity: 0.14,
          weight: 4,
          opacity: 0.96
        }}
      />
    </>
  );
}

export function RouteMapClient({ routes }: { routes: AviationRoute[] }) {
  return (
    <MapContainer center={[45, 10]} zoom={2} scrollWheelZoom={false} className="aviation-map-shell h-[480px] w-full rounded-[30px]">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors & CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <ZoneRings center={[73, -40]} outerRadius={2100000} midRadius={1750000} innerRadius={1320000} tone="cyan" />
      <ZoneRings center={[68, 80]} outerRadius={1900000} midRadius={1540000} innerRadius={1180000} tone="orange" />

      {routes.map((route) => (
        <Fragment key={route.id}>
          <Polyline
            positions={route.coordinates}
            className="aviation-route-line"
            pathOptions={{ color: routeColor[route.risk], weight: 4.5, opacity: 0.95 }}
          >
            <Tooltip sticky>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{route.airline}</p>
                <p>
                  {route.from} to {route.to}
                </p>
                <p>ETA {route.eta}</p>
                <p>Risk {route.risk}</p>
              </div>
            </Tooltip>
          </Polyline>
          <Polyline
            positions={route.alternate}
            className="aviation-route-alternate"
            pathOptions={{ color: "#22d3ee", weight: 2.5, opacity: 0.72, dashArray: "8 10" }}
          />
          <Marker
            position={route.coordinates[route.coordinates.length - 1]}
            icon={getPlaneIcon(routeColor[route.risk], getRouteHeading(route))}
            interactive={false}
          />
        </Fragment>
      ))}
    </MapContainer>
  );
}

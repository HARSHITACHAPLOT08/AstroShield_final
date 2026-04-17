"use client";

import { Fragment } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import type { LocationRisk } from "@/types";

function riskColor(value: number) {
  if (value >= 85) return "#ec4899";
  if (value >= 70) return "#fb7185";
  if (value >= 55) return "#f59e0b";
  return "#22c55e";
}

export function RiskMapClient({
  locations,
  severityFactor = 1
}: {
  locations: LocationRisk[];
  severityFactor?: number;
}) {
  return (
    <MapContainer center={[28, 0]} zoom={2} scrollWheelZoom={false} className="h-[500px] w-full rounded-[26px]">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors & CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {locations.map((location) => (
        <Fragment key={location.id}>
          <CircleMarker
            key={`${location.id}-ring`}
            center={[location.lat, location.lng]}
            radius={Math.max(14, (location.risk * severityFactor) / 5.2)}
            interactive={false}
            pathOptions={{
              color: riskColor(location.risk * severityFactor),
              fillColor: riskColor(location.risk * severityFactor),
              fillOpacity: 0.16,
              weight: 0.8,
              opacity: 0.45
            }}
          />

          <CircleMarker
            key={location.id}
            center={[location.lat, location.lng]}
            radius={Math.max(10, (location.risk * severityFactor) / 6.2)}
            pathOptions={{
              color: "#fde68a",
              fillColor: riskColor(location.risk * severityFactor),
              fillOpacity: 0.78,
              opacity: 0.95,
              weight: 2
            }}
          >
            <Tooltip className="risk-map-tooltip" direction="top" offset={[0, -10]} opacity={1}>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-50">{location.name}</p>
                <p className="text-slate-300">{location.country}</p>
                <p className="font-semibold text-cyan-300">Risk {Math.min(99, Math.round(location.risk * severityFactor))}%</p>
              </div>
            </Tooltip>
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{location.name}</p>
                <p>{location.country}</p>
                <p>Risk: {Math.min(99, Math.round(location.risk * severityFactor))}%</p>
                <p>Exposure: {location.exposure} transformers</p>
              </div>
            </Popup>
          </CircleMarker>
        </Fragment>
      ))}
    </MapContainer>
  );
}

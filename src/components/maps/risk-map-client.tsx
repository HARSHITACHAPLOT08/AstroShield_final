"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
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
    <MapContainer center={[28, 0]} zoom={2} scrollWheelZoom={false} className="h-[420px] w-full rounded-[26px]">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors & CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {locations.map((location) => (
        <CircleMarker
          key={location.id}
          center={[location.lat, location.lng]}
          radius={Math.max(8, (location.risk * severityFactor) / 8)}
          pathOptions={{
            color: riskColor(location.risk * severityFactor),
            fillColor: riskColor(location.risk * severityFactor),
            fillOpacity: 0.45,
            weight: 1.2
          }}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{location.name}</p>
              <p>{location.country}</p>
              <p>Risk: {Math.min(99, Math.round(location.risk * severityFactor))}%</p>
              <p>Exposure: {location.exposure} transformers</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

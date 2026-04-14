"use client";

import { Fragment } from "react";
import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, Polyline, TileLayer, Tooltip } from "react-leaflet";
import type { AviationRoute } from "@/types";

const routeColor: Record<AviationRoute["risk"], string> = {
  Low: "#22c55e",
  Moderate: "#f59e0b",
  High: "#ec4899"
};

export function RouteMapClient({ routes }: { routes: AviationRoute[] }) {
  return (
    <MapContainer center={[45, 10]} zoom={2} scrollWheelZoom={false} className="h-[460px] w-full rounded-[26px]">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors & CARTO"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Circle center={[73, -40]} radius={1800000} pathOptions={{ color: "#38bdf8", fillColor: "#38bdf8", fillOpacity: 0.08 }} />
      <Circle center={[68, 80]} radius={1600000} pathOptions={{ color: "#ec4899", fillColor: "#ec4899", fillOpacity: 0.08 }} />

      {routes.map((route) => (
        <Fragment key={route.id}>
          <Polyline
            positions={route.coordinates}
            pathOptions={{ color: routeColor[route.risk], weight: 4, opacity: 0.8 }}
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
            pathOptions={{ color: "#22d3ee", weight: 2, opacity: 0.45, dashArray: "8 8" }}
          />
        </Fragment>
      ))}
    </MapContainer>
  );
}

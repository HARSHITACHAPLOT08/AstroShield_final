export type UserRole = "Analyst" | "Operator" | "Admin";

export type Severity = "Watch" | "Warning" | "Alert" | "Emergency";

export interface Metric {
  label: string;
  value: number;
  unit: string;
  change: number;
  severity: "low" | "moderate" | "high" | "critical";
  sparkline: number[];
}

export interface AlertItem {
  id: string;
  title: string;
  severity: Severity;
  timestamp: string;
  summary: string;
  target: string;
  action: string;
  status: "open" | "investigating" | "resolved";
}

export interface LocationRisk {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  risk: number;
  exposure: number;
  impact: number;
  latitudeBand: string;
}

export interface SatelliteAsset {
  id: string;
  name: string;
  orbit: "LEO" | "MEO" | "GEO";
  longitude: number;
  latitude: number;
  risk: "Low" | "Moderate" | "High" | "Critical";
  operator: string;
  radiation: number;
  drag: number;
}

export interface AviationRoute {
  id: string;
  airline: string;
  from: string;
  to: string;
  risk: "Low" | "Moderate" | "High";
  eta: string;
  fuelDelta: number;
  coordinates: [number, number][];
  alternate: [number, number][];
}

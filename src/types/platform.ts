import type { AlertItem, AviationRoute, LocationRisk, Metric, SatelliteAsset } from "@/types";

export interface LandingData {
  ticker: Array<{ label: string; value: string }>;
  sources: string[];
  workflow: string[];
  stakeholders: string[];
  modules: Array<{ title: string; summary: string }>;
  testimonials: Array<{ name: string; quote: string; role: string }>;
}

export interface DashboardData {
  stats: Metric[];
  solarActivity: Array<{ time: string; wind: number; bz: number; kp: number }>;
  geomagneticScale: Array<{ name: string; value: number }>;
  timeline: Array<{ time: string; event: string; impact: string }>;
}

export interface SolarMonitorData {
  cmes: Array<{ name: string; speed: number; direction: string; eta: string; confidence: number }>;
  activeRegions: Array<{ region: string; class: string; flareRisk: number; x: number; y: number }>;
  bz48h: Array<{ time: string; value: number }>;
  flares: Array<{ time: string; class: string; region: string; peak: string; impact: string }>;
  history: Array<{ date: string; events: number }>;
}

export interface PredictionData {
  forecast: Array<{ window: string; probability: number; confidence: number }>;
  flareClass: Array<{ name: string; value: number }>;
  drivers: Array<{ name: string; value: number }>;
  performance: Array<{ label: string; value: number }>;
  confusionMatrix: number[][];
  history: Array<{ date: string; predicted: number; observed: number }>;
}

export interface SatelliteData {
  assets: SatelliteAsset[];
  alerts: string[];
  exposure: Array<{ time: string; radiation: number; drag: number }>;
}

export interface AviationData {
  routes: AviationRoute[];
  zones: Array<{ name: string; severity: number }>;
  incidents: Array<{ date: string; title: string }>;
}

export interface AnalyticsData {
  stormHistory: Array<{ date: string; gScale: number; impact: number }>;
  cycleTrend: Array<{ phase: string; sunspots: number; storms: number }>;
  reports: string[];
}

export interface AdminData {
  users: Array<{ name: string; email: string; role: string; status: string }>;
  apiHealth: Array<{ name: string; status: string; latency: number }>;
  logs: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  organization: string;
  email: string;
  timezone: string;
  channels: Array<{ name: string; enabled: boolean }>;
  preferences: string[];
}

export interface PlatformResourceMap {
  landing: LandingData;
  dashboard: DashboardData;
  alerts: AlertItem[];
  "solar-monitor": SolarMonitorData;
  "ai-predictions": PredictionData;
  "grid-risk": LocationRisk[];
  satellites: SatelliteData;
  aviation: AviationData;
  analytics: AnalyticsData;
  admin: AdminData;
  profile: ProfileData;
}

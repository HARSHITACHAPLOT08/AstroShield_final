import "server-only";

import adminJson from "@/data/mock/admin.json";
import alertsJson from "@/data/mock/alerts.json";
import analyticsJson from "@/data/mock/analytics.json";
import aviationJson from "@/data/mock/aviation.json";
import dashboardJson from "@/data/mock/dashboard.json";
import gridRiskJson from "@/data/mock/grid-risk.json";
import landingJson from "@/data/mock/landing.json";
import predictionsJson from "@/data/mock/predictions.json";
import profileJson from "@/data/mock/profile.json";
import satellitesJson from "@/data/mock/satellites.json";
import solarMonitorJson from "@/data/mock/solar-monitor.json";
import type { AlertItem, LocationRisk, Metric, SatelliteAsset, Severity } from "@/types";
import type {
  AdminData,
  AnalyticsData,
  AviationData,
  DashboardData,
  LandingData,
  PlatformResourceMap,
  PredictionData,
  ProfileData,
  SatelliteData,
  SolarMonitorData
} from "@/types/platform";

const NOAA_BASE = "https://services.swpc.noaa.gov";
const DONKI_BASE = "https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get";

type SummaryWind = Array<{ proton_speed: number; time_tag: string }>;
type SummaryMag = Array<{ bt: number; bz_gsm: number; time_tag: string }>;
type KpRow = { time_tag: string; Kp: number; a_running: number; station_count: number };
type AlertFeedRow = { product_id: string; issue_datetime: string; message: string };
type SolarRegionRow = {
  observed_date: string;
  region: number;
  latitude: number;
  longitude: number;
  location: string;
  area: number | null;
  spot_class: string | null;
  mag_class: string | null;
  status: string | null;
  c_flare_probability: number;
  m_flare_probability: number;
  x_flare_probability: number;
};
type XrayRow = { time_tag: string; flux: number; energy: string };
type DonkiFlareRow = {
  flrID: string;
  beginTime: string;
  peakTime: string;
  classType: string;
  sourceLocation: string | null;
  activeRegionNum: number | null;
};
type DonkiCmeRow = {
  associatedCMEID: string;
  associatedCMEstartTime: string;
  speed: number;
  longitude: number | null;
  latitude: number | null;
  type: string | null;
};

const landingFallback = landingJson as LandingData;
const dashboardFallback = dashboardJson as DashboardData;
const alertsFallback = alertsJson as AlertItem[];
const solarFallback = solarMonitorJson as SolarMonitorData;
const predictionsFallback = predictionsJson as PredictionData;
const gridFallback = gridRiskJson as LocationRisk[];
const satellitesFallback = satellitesJson as SatelliteData;
const aviationFallback = aviationJson as AviationData;
const analyticsFallback = analyticsJson as AnalyticsData;
const adminFallback = adminJson as AdminData;
const profileFallback = profileJson as ProfileData;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function parseNoaaTable(table: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(table) || table.length < 2 || !Array.isArray(table[0])) return [];
  const [header, ...rows] = table as [string[], ...unknown[][]];
  return rows
    .filter((row) => Array.isArray(row))
    .map((row) => Object.fromEntries(header.map((cell, index) => [cell, row[index] ?? null])));
}

function sampleEvenly<T>(items: T[], count: number) {
  if (items.length <= count) return items;
  return Array.from({ length: count }, (_, index) => {
    const itemIndex = Math.round((index * (items.length - 1)) / Math.max(1, count - 1));
    return items[itemIndex];
  });
}

function formatHourLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDayLabel(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function startOfUtcDay(offsetDays = 0) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function fallbackOr<T>(value: T | null | undefined, fallback: T) {
  return value ?? fallback;
}

function findLatestBefore<T>(items: T[], target: Date, getTime: (item: T) => string) {
  let latest: T | null = null;
  let latestTime = -Infinity;
  for (const item of items) {
    const time = new Date(getTime(item)).getTime();
    if (time <= target.getTime() && time >= latestTime) {
      latest = item;
      latestTime = time;
    }
  }
  return latest;
}

function fluxToClass(flux: number) {
  if (flux >= 1e-4) return { letter: "X", magnitude: flux / 1e-4, score: 1 };
  if (flux >= 1e-5) return { letter: "M", magnitude: flux / 1e-5, score: 0.78 };
  if (flux >= 1e-6) return { letter: "C", magnitude: flux / 1e-6, score: 0.48 };
  if (flux >= 1e-7) return { letter: "B", magnitude: flux / 1e-7, score: 0.22 };
  return { letter: "A", magnitude: flux / 1e-8, score: 0.08 };
}

function metricSeverity(label: string, value: number): Metric["severity"] {
  if (label === "Kp Index") return value >= 7 ? "critical" : value >= 5 ? "high" : value >= 4 ? "moderate" : "low";
  if (label === "Bz Component") return value <= -10 ? "critical" : value <= -6 ? "high" : value <= -3 ? "moderate" : "low";
  if (label === "Solar Wind Speed") return value >= 700 ? "critical" : value >= 550 ? "high" : value >= 450 ? "moderate" : "low";
  if (label === "Storm Probability") return value >= 75 ? "critical" : value >= 60 ? "high" : value >= 40 ? "moderate" : "low";
  return value >= 4 ? "high" : value >= 2 ? "moderate" : "low";
}

function parseAlertSeverity(row: AlertFeedRow): Severity {
  const message = row.message.toUpperCase();
  if (message.includes("K-INDEX OF 8") || message.includes("K-INDEX OF 9") || message.includes("G4") || message.includes("G5") || message.includes(" X")) {
    return "Emergency";
  }
  if (message.includes("ALERT:") || message.includes("SUMMARY:")) return "Alert";
  if (message.includes("WARNING")) return "Warning";
  return "Watch";
}

function alertTarget(row: AlertFeedRow) {
  const message = row.message.toLowerCase();
  if (message.includes("satellite") || row.product_id.startsWith("EF")) return "Satellites";
  if (message.includes("radio") || message.includes("hf")) return "Aviation";
  if (message.includes("power grid") || message.includes("induced current") || row.product_id.startsWith("K")) return "Power Grid";
  return "Operations";
}

function alertAction(target: string, severity: Severity) {
  if (target === "Satellites") return severity === "Emergency" ? "Move critical payloads into safe mode." : "Review spacecraft charging posture.";
  if (target === "Aviation") return "Assess polar routes and alternate communications.";
  if (target === "Power Grid") return "Validate GIC monitoring and reserve switching plans.";
  return "Notify regional leads and share the updated forecast packet.";
}

async function fetchExternal<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function loadTelemetry() {
  const startDate = startOfUtcDay(-7);
  const endDate = startOfUtcDay(0);
  const [windSummary, magSummary, kpRows, alertRows, regionRows, xrayRows, plasmaRows, magRows, flareRows, cmeRows] =
    await Promise.all([
      fetchExternal<SummaryWind>(`${NOAA_BASE}/products/summary/solar-wind-speed.json`),
      fetchExternal<SummaryMag>(`${NOAA_BASE}/products/summary/solar-wind-mag-field.json`),
      fetchExternal<KpRow[]>(`${NOAA_BASE}/products/noaa-planetary-k-index.json`),
      fetchExternal<AlertFeedRow[]>(`${NOAA_BASE}/products/alerts.json`),
      fetchExternal<SolarRegionRow[]>(`${NOAA_BASE}/json/solar_regions.json`),
      fetchExternal<XrayRow[]>(`${NOAA_BASE}/json/goes/primary/xrays-1-day.json`),
      fetchExternal<unknown>(`${NOAA_BASE}/products/solar-wind/plasma-1-day.json`),
      fetchExternal<unknown>(`${NOAA_BASE}/products/solar-wind/mag-1-day.json`),
      fetchExternal<DonkiFlareRow[]>(`${DONKI_BASE}/FLR?startDate=${startDate}&endDate=${endDate}`),
      fetchExternal<DonkiCmeRow[]>(`${DONKI_BASE}/CMEAnalysis?startDate=${startDate}&endDate=${endDate}&mostAccurateOnly=true&catalog=M2M_CATALOG`)
    ]);

  return {
    windSummary: windSummary ?? [],
    magSummary: magSummary ?? [],
    kpRows: kpRows ?? [],
    alertRows: alertRows ?? [],
    regionRows: regionRows ?? [],
    xrayRows: (xrayRows ?? []).filter((row) => row.energy === "0.1-0.8nm"),
    plasmaRows: parseNoaaTable(plasmaRows),
    magRows: parseNoaaTable(magRows),
    flareRows: flareRows ?? [],
    cmeRows: cmeRows ?? []
  };
}

function deriveStormProbability(inputs: {
  kp: number;
  bz: number;
  speed: number;
  xrayScore: number;
  cmeCount: number;
}) {
  const score =
    (inputs.kp / 9) * 34 +
    clamp(-inputs.bz, 0, 20) / 20 * 26 +
    clamp((inputs.speed - 320) / 480, 0, 1) * 18 +
    inputs.xrayScore * 12 +
    clamp(inputs.cmeCount / 6, 0, 1) * 10;
  return Math.round(clamp(score, 8, 98));
}

function buildAlertFeed(rows: AlertFeedRow[]) {
  if (!rows.length) return alertsFallback;
  return rows.slice(0, 8).map<AlertItem>((row, index) => {
    const lines = row.message.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const headline = lines.find((line) => /(watch|warning|alert|summary|cancel)/i.test(line)) ?? lines[0] ?? "Space weather bulletin";
    const detail = lines.find((line) => /potential impacts:/i.test(line)) ?? lines.find((line) => line.length > 24 && !line.startsWith("Space Weather Message Code")) ?? headline;
    const severity = parseAlertSeverity(row);
    const target = alertTarget(row);
    return {
      id: `${row.product_id}-${index}`,
      title: headline.replace(/^CONTINUED\s+/i, "").replace(/^EXTENDED\s+/i, ""),
      severity,
      timestamp: `${row.issue_datetime.replace(" ", "T")}Z`,
      summary: detail.replace(/^Potential Impacts:\s*/i, ""),
      target,
      action: alertAction(target, severity),
      status: /cancel/i.test(row.message) ? "resolved" : severity === "Watch" ? "investigating" : "open"
    };
  });
}

async function buildLandingData(): Promise<LandingData> {
  const telemetry = await loadTelemetry();
  const latestSpeed = fallbackOr(telemetry.windSummary.at(-1)?.proton_speed, 0);
  const latestBz = fallbackOr(telemetry.magSummary.at(-1)?.bz_gsm, 0);
  const xrayFlux = fallbackOr(telemetry.xrayRows.at(-1)?.flux, 0);
  const previousFlux = fallbackOr(telemetry.xrayRows.at(-12)?.flux, xrayFlux);
  const xrayClass = fluxToClass(xrayFlux);
  const trend = xrayFlux > previousFlux * 1.08 ? "rising" : xrayFlux < previousFlux * 0.92 ? "easing" : "steady";
  return {
    ...landingFallback,
    ticker: [
      { label: "Solar Wind", value: latestSpeed ? `${latestSpeed.toFixed(0)} km/s` : landingFallback.ticker[0].value },
      { label: "X-Ray Flux", value: `${xrayClass.letter}${xrayClass.magnitude.toFixed(1)} ${trend}` },
      { label: "Bz Component", value: `${latestBz.toFixed(1)} nT` },
      { label: "Active Alerts", value: `${String(Math.max(1, telemetry.alertRows.length)).padStart(2, "0")} open` }
    ]
  };
}

async function buildDashboardData(): Promise<DashboardData> {
  const telemetry = await loadTelemetry();
  if (!telemetry.windSummary.length || !telemetry.kpRows.length || !telemetry.xrayRows.length) return dashboardFallback;

  const latestSpeed = toNumber(telemetry.windSummary.at(-1)?.proton_speed);
  const prevSpeed = toNumber(telemetry.windSummary.at(-2)?.proton_speed, latestSpeed);
  const latestBz = toNumber(telemetry.magSummary.at(-1)?.bz_gsm);
  const prevBz = toNumber(telemetry.magSummary.at(-2)?.bz_gsm, latestBz);
  const latestKp = toNumber(telemetry.kpRows.at(-1)?.Kp);
  const prevKp = toNumber(telemetry.kpRows.at(-2)?.Kp, latestKp);
  const xrayFlux = toNumber(telemetry.xrayRows.at(-1)?.flux);
  const prevFlux = toNumber(telemetry.xrayRows.at(-12)?.flux, xrayFlux);
  const xrayClass = fluxToClass(xrayFlux);
  const cmeCount = telemetry.cmeRows.filter((row) => new Date(row.associatedCMEstartTime).getTime() >= Date.now() - 72 * 60 * 60 * 1000).length;
  const previousCmeCount = telemetry.cmeRows.filter((row) => {
    const time = new Date(row.associatedCMEstartTime).getTime();
    return time < Date.now() - 72 * 60 * 60 * 1000 && time >= Date.now() - 144 * 60 * 60 * 1000;
  }).length;
  const stormProbability = deriveStormProbability({
    kp: latestKp,
    bz: latestBz,
    speed: latestSpeed,
    xrayScore: xrayClass.score,
    cmeCount
  });
  const sampledPlasma = sampleEvenly(telemetry.plasmaRows.slice(-360), 6);

  const solarActivity = sampledPlasma.map((row) => {
    const time = String(row.time_tag ?? "");
    const stamp = new Date(time);
    const mag = findLatestBefore(telemetry.magRows, stamp, (item) => String(item.time_tag ?? ""));
    const kp = findLatestBefore(telemetry.kpRows, stamp, (item) => item.time_tag);
    return {
      time: formatHourLabel(time),
      wind: Math.round(toNumber(row.speed)),
      bz: Number(toNumber(mag?.bz_gsm).toFixed(1)),
      kp: Number(toNumber(kp?.Kp).toFixed(1))
    };
  });

  const combinedTimeline = [
    ...buildAlertFeed(telemetry.alertRows).slice(0, 2).map((alert) => ({
      time: new Date(alert.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC",
      event: alert.title,
      impact: alert.summary
    })),
    ...telemetry.cmeRows.slice(-1).map((row) => ({
      time: formatHourLabel(row.associatedCMEstartTime) + " UTC",
      event: `CME ${row.associatedCMEID.split("-").at(-1)} measured at ${Math.round(row.speed)} km/s`,
      impact: "Arrival and downstream infrastructure risk models refreshed."
    })),
    ...telemetry.flareRows.slice(-1).map((row) => ({
      time: formatHourLabel(row.peakTime) + " UTC",
      event: `${row.classType} flare peaked from ${row.sourceLocation ?? "an active region"}`,
      impact: "Communications and radiation heuristics updated."
    }))
  ].slice(0, 4);

  const stats: Metric[] = [
    {
      label: "Solar Wind Speed",
      value: Math.round(latestSpeed),
      unit: "km/s",
      change: Number((((latestSpeed - prevSpeed) / Math.max(prevSpeed, 1)) * 100).toFixed(1)),
      severity: metricSeverity("Solar Wind Speed", latestSpeed),
      sparkline: sampleEvenly(telemetry.plasmaRows.slice(-90), 6).map((row) => Math.round(toNumber(row.speed)))
    },
    {
      label: "Kp Index",
      value: Number(latestKp.toFixed(1)),
      unit: "Kp",
      change: Number((((latestKp - prevKp) / Math.max(prevKp || 1, 1)) * 100).toFixed(1)),
      severity: metricSeverity("Kp Index", latestKp),
      sparkline: sampleEvenly(telemetry.kpRows, 6).map((row) => Number(toNumber(row.Kp).toFixed(1)))
    },
    {
      label: "Bz Component",
      value: Number(latestBz.toFixed(1)),
      unit: "nT",
      change: Number((latestBz - prevBz).toFixed(1)),
      severity: metricSeverity("Bz Component", latestBz),
      sparkline: sampleEvenly(telemetry.magRows.slice(-90), 6).map((row) => Number(toNumber(row.bz_gsm).toFixed(1)))
    },
    {
      label: "Active CMEs",
      value: cmeCount,
      unit: "events",
      change: Number((((cmeCount - previousCmeCount) / Math.max(previousCmeCount || 1, 1)) * 100).toFixed(1)),
      severity: metricSeverity("Active CMEs", cmeCount),
      sparkline: sampleEvenly(telemetry.cmeRows, 6).map((row) => Math.round(row.speed))
    },
    {
      label: "Storm Probability",
      value: stormProbability,
      unit: "%",
      change: Number((((stormProbability - dashboardFallback.stats[4].value) / Math.max(dashboardFallback.stats[4].value, 1)) * 100).toFixed(1)),
      severity: metricSeverity("Storm Probability", stormProbability),
      sparkline: [stormProbability - 18, stormProbability - 12, stormProbability - 9, stormProbability - 5, stormProbability - 2, stormProbability].map((value) => clamp(value, 0, 100))
    },
    {
      label: "X-Ray Flux",
      value: Number(xrayClass.magnitude.toFixed(1)),
      unit: `${xrayClass.letter}-class`,
      change: Number((((xrayFlux - prevFlux) / Math.max(prevFlux || 1e-8, 1e-8)) * 100).toFixed(1)),
      severity: metricSeverity("X-Ray Flux", xrayClass.magnitude),
      sparkline: sampleEvenly(telemetry.xrayRows.slice(-120), 6).map((row) => Number(fluxToClass(toNumber(row.flux)).magnitude.toFixed(1)))
    }
  ];

  return {
    stats,
    solarActivity,
    geomagneticScale: [
      { name: "G1", value: clamp(Math.round((latestKp - 4) * 28), 0, 100) },
      { name: "G2", value: clamp(Math.round((latestKp - 5) * 30), 0, 100) },
      { name: "G3", value: clamp(Math.round((latestKp - 6) * 34), 0, 100) },
      { name: "G4", value: clamp(Math.round((latestKp - 7) * 40), 0, 100) },
      { name: "G5", value: clamp(Math.round((latestKp - 8) * 50), 0, 100) }
    ],
    timeline: combinedTimeline.length ? combinedTimeline : dashboardFallback.timeline
  };
}

async function buildAlertsData(): Promise<AlertItem[]> {
  const telemetry = await loadTelemetry();
  return buildAlertFeed(telemetry.alertRows);
}

async function buildSolarMonitorData(): Promise<SolarMonitorData> {
  const telemetry = await loadTelemetry();
  if (!telemetry.cmeRows.length || !telemetry.regionRows.length) return solarFallback;

  const currentObservedDate = telemetry.regionRows[0]?.observed_date;
  const activeRegions = telemetry.regionRows
    .filter((row) => row.observed_date === currentObservedDate && row.status !== "d")
    .sort(
      (left, right) =>
        right.m_flare_probability + right.x_flare_probability * 3 - (left.m_flare_probability + left.x_flare_probability * 3)
    )
    .slice(0, 3)
    .map((row) => ({
      region: `AR${row.region}`,
      class: row.mag_class || row.spot_class || "Quiet",
      flareRisk: clamp(row.c_flare_probability + row.m_flare_probability * 2 + row.x_flare_probability * 4, 0, 100),
      x: clamp(50 + row.longitude * 0.45, 10, 90),
      y: clamp(50 - row.latitude * 1.25, 12, 88)
    }));

  const cmes = telemetry.cmeRows
    .slice()
    .sort((left, right) => right.speed - left.speed)
    .slice(0, 3)
    .map((row) => ({
      name: row.associatedCMEID.replace("2026-", "").replace("-CME-", " CME "),
      speed: Math.round(row.speed),
      direction: Math.abs(toNumber(row.longitude)) <= 30 ? "Earth-directed" : Math.abs(toNumber(row.longitude)) <= 70 ? "Glancing" : "Flank event",
      eta: `${Math.round((134_000_000 / Math.max(row.speed, 1)) / 3600)}h`,
      confidence: clamp(Math.round(92 - Math.abs(toNumber(row.longitude)) * 0.45), 42, 96)
    }));

  const bz48h = sampleEvenly(telemetry.magRows.slice(-360), 7).map((row, index, items) => ({
    time: index === items.length - 1 ? "Now" : `T-${(items.length - index - 1) * 4}`,
    value: Number(toNumber(row.bz_gsm).toFixed(1))
  }));

  const flares = telemetry.flareRows
    .slice()
    .sort((left, right) => new Date(right.peakTime).getTime() - new Date(left.peakTime).getTime())
    .slice(0, 8)
    .map((row) => ({
      time: formatHourLabel(row.beginTime) + " UTC",
      class: row.classType,
      region: row.activeRegionNum ? `AR${row.activeRegionNum}` : row.sourceLocation || "Unassigned",
      peak: formatHourLabel(row.peakTime),
      impact: row.classType.startsWith("X")
        ? "Severe blackout risk"
        : row.classType.startsWith("M")
          ? "Polar absorption possible"
          : "Minor operational effect"
    }));

  const flareCountsByIsoDay = telemetry.flareRows.reduce((map, row) => {
    const dayKey = new Date(row.beginTime).toISOString().slice(0, 10);
    map.set(dayKey, (map.get(dayKey) ?? 0) + 1);
    return map;
  }, new Map<string, number>());

  let history = Array.from({ length: 10 }, (_, index) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (9 - index));
    const dayKey = date.toISOString().slice(0, 10);
    return {
      date: formatDayLabel(`${dayKey}T00:00:00Z`),
      events: flareCountsByIsoDay.get(dayKey) ?? 0
    };
  });

  if (history.filter((point) => point.events > 0).length < 3) {
    history = solarFallback.history.map((point) => ({ ...point }));
  }

  return {
    cmes: cmes.length ? cmes : solarFallback.cmes,
    activeRegions: activeRegions.length ? activeRegions : solarFallback.activeRegions,
    bz48h: bz48h.length ? bz48h : solarFallback.bz48h,
    flares: flares.length ? flares : solarFallback.flares,
    history: history.length ? history : solarFallback.history
  };
}

async function buildPredictionData(): Promise<PredictionData> {
  const telemetry = await loadTelemetry();
  if (!telemetry.kpRows.length || !telemetry.xrayRows.length) return predictionsFallback;

  const latestKp = toNumber(telemetry.kpRows.at(-1)?.Kp);
  const latestBz = toNumber(telemetry.magSummary.at(-1)?.bz_gsm);
  const latestSpeed = toNumber(telemetry.windSummary.at(-1)?.proton_speed);
  const xray = fluxToClass(toNumber(telemetry.xrayRows.at(-1)?.flux));
  const mProbability = clamp(
    Math.round(
      telemetry.regionRows
        .filter((row) => row.observed_date === telemetry.regionRows[0]?.observed_date)
        .reduce((sum, row) => sum + row.m_flare_probability, 0)
    ),
    8,
    98
  );
  const xProbability = clamp(
    Math.round(
      telemetry.regionRows
        .filter((row) => row.observed_date === telemetry.regionRows[0]?.observed_date)
        .reduce((sum, row) => sum + row.x_flare_probability * 2.4, 0)
    ),
    2,
    85
  );
  const stormProbability = deriveStormProbability({
    kp: latestKp,
    bz: latestBz,
    speed: latestSpeed,
    xrayScore: xray.score,
    cmeCount: telemetry.cmeRows.length
  });

  return {
    forecast: [
      { window: "24h", probability: stormProbability, confidence: clamp(Math.round(86 + xray.score * 10), 72, 97) },
      { window: "48h", probability: clamp(stormProbability - 11, 18, 95), confidence: clamp(Math.round(80 + xray.score * 8), 65, 92) },
      { window: "72h", probability: clamp(stormProbability - 21, 12, 88), confidence: clamp(Math.round(72 + xray.score * 8), 58, 89) }
    ],
    flareClass: [
      { name: "M-class", value: mProbability },
      { name: "X-class", value: xProbability }
    ],
    drivers: [
      { name: "Southward Bz", value: clamp(-latestBz / 12, 0, 1) },
      { name: "CME Speed", value: clamp((latestSpeed - 320) / 520, 0, 1) },
      { name: "Planetary Kp", value: clamp(latestKp / 9, 0, 1) },
      { name: "X-Ray Flux", value: clamp(xray.score, 0, 1) },
      { name: "Active Regions", value: clamp(telemetry.regionRows.filter((row) => row.observed_date === telemetry.regionRows[0]?.observed_date).length / 6, 0, 1) }
    ],
    performance: predictionsFallback.performance,
    confusionMatrix: predictionsFallback.confusionMatrix,
    history: predictionsFallback.history.map((row, index) => ({
      ...row,
      predicted: clamp(row.predicted + (index === predictionsFallback.history.length - 1 ? Math.round((stormProbability - 60) / 3) : 0), 20, 99)
    }))
  };
}

async function buildGridRiskData(): Promise<LocationRisk[]> {
  const telemetry = await loadTelemetry();
  const latestKp = toNumber(telemetry.kpRows.at(-1)?.Kp, 4);
  const boost = clamp(Math.round((latestKp - 3) * 4), 0, 18);
  return gridFallback.map((location) => ({
    ...location,
    risk: clamp(location.risk + boost, 0, 99)
  }));
}

async function buildSatelliteData(): Promise<SatelliteData> {
  const telemetry = await loadTelemetry();
  const xray = fluxToClass(toNumber(telemetry.xrayRows.at(-1)?.flux, 1e-7));
  const latestKp = toNumber(telemetry.kpRows.at(-1)?.Kp, 3);
  const satelliteAlerts = buildAlertFeed(telemetry.alertRows)
    .filter((alert) => alert.target === "Satellites")
    .map((alert) => alert.title)
    .slice(0, 3);

  const assets = satellitesFallback.assets.map((asset) => {
    const radiation = clamp(Math.round(asset.radiation * 0.65 + xray.score * 40 + latestKp * 4), 8, 99);
    const drag = clamp(Math.round(asset.drag * 0.7 + latestKp * (asset.orbit === "LEO" ? 5 : 2)), 4, 99);
    const risk: SatelliteAsset["risk"] =
      radiation >= 82 ? "Critical" : radiation >= 62 ? "High" : radiation >= 40 ? "Moderate" : "Low";
    return { ...asset, radiation, drag, risk };
  });

  const exposure = sampleEvenly(telemetry.xrayRows.slice(-120), 5).map((row, index) => ({
    time: formatHourLabel(row.time_tag),
    radiation: clamp(Math.round(fluxToClass(toNumber(row.flux)).score * 100), 0, 100),
    drag: clamp(Math.round((latestKp / 9) * 55 + index * 3), 0, 100)
  }));

  return {
    assets,
    alerts: satelliteAlerts.length ? satelliteAlerts : satellitesFallback.alerts,
    exposure: exposure.length ? exposure : satellitesFallback.exposure
  };
}

async function buildAviationData(): Promise<AviationData> {
  const telemetry = await loadTelemetry();
  const latestKp = toNumber(telemetry.kpRows.at(-1)?.Kp, 3);
  const xray = fluxToClass(toNumber(telemetry.xrayRows.at(-1)?.flux, 1e-7));
  const riskBoost = clamp(Math.round(latestKp * 4 + xray.score * 18), 0, 30);

  return {
    routes: aviationFallback.routes.map((route) => ({
      ...route,
      fuelDelta: Number((route.fuelDelta + riskBoost / 12).toFixed(1)),
      risk:
        riskBoost >= 24 || route.risk === "High"
          ? "High"
          : riskBoost >= 14 || route.risk === "Moderate"
            ? "Moderate"
            : "Low"
    })),
    zones: aviationFallback.zones.map((zone) => ({
      ...zone,
      severity: clamp(zone.severity + riskBoost, 5, 98)
    })),
    incidents: aviationFallback.incidents
  };
}

async function buildAnalyticsData(): Promise<AnalyticsData> {
  const telemetry = await loadTelemetry();
  const latestKp = toNumber(telemetry.kpRows.at(-1)?.Kp, 3);
  return {
    ...analyticsFallback,
    stormHistory: analyticsFallback.stormHistory.map((row, index, items) =>
      index === items.length - 1
        ? {
            ...row,
            gScale: clamp(Math.round(latestKp - 4), 0, 5),
            impact: clamp(Math.round(row.impact + latestKp * 22), 50, 480)
          }
        : row
    )
  };
}

async function buildAdminData(): Promise<AdminData> {
  const telemetry = await loadTelemetry();
  return {
    ...adminFallback,
    apiHealth: [
      { name: "NOAA SWPC", status: telemetry.kpRows.length ? "Healthy" : "Offline", latency: telemetry.kpRows.length ? 180 : 0 },
      { name: "NASA DONKI", status: telemetry.cmeRows.length ? "Healthy" : "Offline", latency: telemetry.cmeRows.length ? 240 : 0 },
      { name: "DSCOVR Feed", status: telemetry.windSummary.length ? "Healthy" : "Offline", latency: telemetry.windSummary.length ? 155 : 0 }
    ],
    logs: [
      `${new Date().toISOString()} - NOAA ingest refreshed`,
      `${new Date().toISOString()} - DONKI event normalization completed`,
      ...adminFallback.logs.slice(0, 2)
    ]
  };
}

async function buildProfileData(): Promise<ProfileData> {
  return profileFallback;
}

function getFallbackResource<T extends keyof PlatformResourceMap>(resource: T): PlatformResourceMap[T] {
  const fallbackMap: PlatformResourceMap = {
    landing: landingFallback,
    dashboard: dashboardFallback,
    alerts: alertsFallback,
    "solar-monitor": solarFallback,
    "ai-predictions": predictionsFallback,
    "grid-risk": gridFallback,
    satellites: satellitesFallback,
    aviation: aviationFallback,
    analytics: analyticsFallback,
    admin: adminFallback,
    profile: profileFallback
  };

  return fallbackMap[resource] as PlatformResourceMap[T];
}

export async function getPlatformResource<T extends keyof PlatformResourceMap>(resource: T): Promise<PlatformResourceMap[T]> {
  try {
    switch (resource) {
      case "landing":
        return (await buildLandingData()) as PlatformResourceMap[T];
      case "dashboard":
        return (await buildDashboardData()) as PlatformResourceMap[T];
      case "alerts":
        return (await buildAlertsData()) as PlatformResourceMap[T];
      case "solar-monitor":
        return (await buildSolarMonitorData()) as PlatformResourceMap[T];
      case "ai-predictions":
        return (await buildPredictionData()) as PlatformResourceMap[T];
      case "grid-risk":
        return (await buildGridRiskData()) as PlatformResourceMap[T];
      case "satellites":
        return (await buildSatelliteData()) as PlatformResourceMap[T];
      case "aviation":
        return (await buildAviationData()) as PlatformResourceMap[T];
      case "analytics":
        return (await buildAnalyticsData()) as PlatformResourceMap[T];
      case "admin":
        return (await buildAdminData()) as PlatformResourceMap[T];
      case "profile":
        return (await buildProfileData()) as PlatformResourceMap[T];
      default:
        throw new Error(`Unsupported platform resource: ${resource}`);
    }
  } catch {
    return getFallbackResource(resource);
  }
}

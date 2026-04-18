import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NOAA_BASE = "https://services.swpc.noaa.gov";
const DONKI_BASE = "https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get";

type KpRow = { time_tag?: string; Kp?: number | string };
type WindSummaryRow = { time_tag?: string; proton_speed?: number | string };
type XrayRow = { time_tag?: string; flux?: number | string; energy?: string };
type DonkiFlareRow = { classType?: string; beginTime?: string; peakTime?: string };

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

function pickLatestKp(payload: unknown) {
  if (!Array.isArray(payload)) return null;

  const rows = payload as unknown[];
  if (rows.length > 0 && Array.isArray(rows[0])) {
    const parsedRows = parseNoaaTable(payload) as Array<{ time_tag?: string; kp_index?: number | string; kp?: number | string; Kp?: number | string }>;
    const latest = parsedRows.at(-1);
    if (!latest) return null;
    return {
      time: String(latest.time_tag ?? ""),
      kp: toNumber(latest.Kp ?? latest.kp_index ?? latest.kp, 0)
    };
  }

  const typedRows = rows as KpRow[];
  const latest = typedRows.at(-1);
  if (!latest) return null;
  return {
    time: String(latest.time_tag ?? ""),
    kp: toNumber(latest.Kp, 0)
  };
}

function fluxToFlareLabel(flux: number) {
  if (flux >= 1e-4) return "X-class flare";
  if (flux >= 1e-5) return "M-class flare";
  if (flux >= 1e-6) return "C-class flare";
  return "Quiet";
}

function normalizeDonkiClassLabel(value: string) {
  if (value.startsWith("X")) return "X-class flare";
  if (value.startsWith("M")) return "M-class flare";
  if (value.startsWith("C")) return "C-class flare";
  return "Quiet";
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function getUtcDate(daysOffset = 0) {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  now.setUTCDate(now.getUTCDate() + daysOffset);
  return now.toISOString().slice(0, 10);
}

export async function GET() {
  const [kpPayload, windSummary, xrayRows, donkiFlares] = await Promise.all([
    fetchJson<unknown>(`${NOAA_BASE}/products/noaa-planetary-k-index.json`),
    fetchJson<WindSummaryRow[]>(`${NOAA_BASE}/products/summary/solar-wind-speed.json`),
    fetchJson<XrayRow[]>(`${NOAA_BASE}/json/goes/primary/xrays-1-day.json`),
    fetchJson<DonkiFlareRow[]>(`${DONKI_BASE}/FLR?startDate=${getUtcDate(-2)}&endDate=${getUtcDate(0)}`)
  ]);

  const latestKp = pickLatestKp(kpPayload);
  const latestWind = windSummary?.at(-1);

  const primaryXray = (xrayRows ?? []).filter((row) => row.energy === "0.1-0.8nm");
  const latestXray = primaryXray.at(-1);

  const recentDonkiFlare = (donkiFlares ?? [])
    .slice()
    .sort((left, right) => {
      const leftTime = new Date(left.peakTime ?? left.beginTime ?? 0).getTime();
      const rightTime = new Date(right.peakTime ?? right.beginTime ?? 0).getTime();
      return rightTime - leftTime;
    })
    .at(0);

  const kpIndex = Math.round(toNumber(latestKp?.kp, 3) * 10) / 10;
  const solarWindSpeed = Math.round(toNumber(latestWind?.proton_speed, 420));
  const flareActivity = recentDonkiFlare?.classType
    ? normalizeDonkiClassLabel(recentDonkiFlare.classType.toUpperCase())
    : fluxToFlareLabel(toNumber(latestXray?.flux, 1e-8));

  const timestamp =
    latestKp?.time ||
    latestWind?.time_tag ||
    latestXray?.time_tag ||
    recentDonkiFlare?.peakTime ||
    new Date().toISOString();

  return NextResponse.json({
    timestamp: new Date(timestamp).toISOString(),
    kpIndex,
    solarWindSpeed,
    flareActivity
  }, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

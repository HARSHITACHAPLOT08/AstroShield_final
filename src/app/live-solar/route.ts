import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const flareLevels = ["Quiet", "C-class flare", "M-class flare", "X-class flare"] as const;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pickFlareByKp(kpIndex: number) {
  if (kpIndex >= 8) return flareLevels[3];
  if (kpIndex >= 6) return flareLevels[2];
  if (kpIndex >= 4) return flareLevels[1];
  return flareLevels[0];
}

export async function GET() {
  const kpRaw = randomBetween(1.4, 7.4);
  const kpIndex = Math.round(kpRaw * 10) / 10;
  const solarWindSpeed = Math.round(randomBetween(330, 890));
  const flareActivity = pickFlareByKp(kpIndex);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    kpIndex,
    solarWindSpeed,
    flareActivity
  });
}

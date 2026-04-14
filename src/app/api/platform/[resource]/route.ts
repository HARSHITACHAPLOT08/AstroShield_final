import { NextResponse } from "next/server";
import { getPlatformResource } from "@/lib/api/platform-server";
import type { PlatformResourceMap } from "@/types/platform";

export const dynamic = "force-dynamic";

function isPlatformResource(value: string): value is keyof PlatformResourceMap {
  return [
    "landing",
    "dashboard",
    "alerts",
    "solar-monitor",
    "ai-predictions",
    "grid-risk",
    "satellites",
    "aviation",
    "analytics",
    "admin",
    "profile"
  ].includes(value);
}

export async function GET(
  _request: Request,
  context: { params: { resource: string } }
) {
  const { resource } = context.params;

  if (!isPlatformResource(resource)) {
    return NextResponse.json({ error: "Unknown platform resource" }, { status: 404 });
  }

  try {
    const payload = await getPlatformResource(resource);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load platform resource",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

import type { PlatformResourceMap } from "@/types/platform";

async function fetchPlatformResource<T extends keyof PlatformResourceMap>(
  resource: T
): Promise<PlatformResourceMap[T]> {
  const response = await fetch(`/api/platform/${resource}`);

  if (!response.ok) {
    throw new Error(`Failed to load platform resource: ${resource}`);
  }

  return (await response.json()) as PlatformResourceMap[T];
}

export const getLandingData = () => fetchPlatformResource("landing");
export const getDashboardData = () => fetchPlatformResource("dashboard");
export const getAlerts = () => fetchPlatformResource("alerts");
export const getSolarMonitorData = () => fetchPlatformResource("solar-monitor");
export const getPredictionData = () => fetchPlatformResource("ai-predictions");
export const getGridRiskData = () => fetchPlatformResource("grid-risk");
export const getSatelliteData = () => fetchPlatformResource("satellites");
export const getAviationData = () => fetchPlatformResource("aviation");
export const getAnalyticsData = () => fetchPlatformResource("analytics");
export const getAdminData = () => fetchPlatformResource("admin");
export const getProfileData = () => fetchPlatformResource("profile");

export const warmPlatformData = () =>
  Promise.all([
    getLandingData(),
    getDashboardData(),
    getAlerts(),
    getSolarMonitorData(),
    getPredictionData(),
    getGridRiskData(),
    getSatelliteData(),
    getAviationData(),
    getAnalyticsData(),
    getAdminData(),
    getProfileData()
  ]).then(() => undefined);

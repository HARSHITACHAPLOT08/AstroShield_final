"use client";

import {
  getAdminData,
  getAlerts,
  getAnalyticsData,
  getAviationData,
  getDashboardData,
  getGridRiskData,
  getLandingData,
  getPredictionData,
  getProfileData,
  getSatelliteData,
  getSolarMonitorLiveData
} from "@/lib/api/platform-client";
import { useMockQuery } from "@/hooks/use-mock-query";

export const useLandingData = () => useMockQuery(getLandingData);
export const useDashboardData = () => useMockQuery(getDashboardData);
export const useAlertsData = () => useMockQuery(getAlerts);
export const useSolarMonitorData = () => useMockQuery(getSolarMonitorLiveData, { refetchIntervalMs: 12000 });
export const usePredictionData = () => useMockQuery(getPredictionData);
export const useGridRiskData = () => useMockQuery(getGridRiskData);
export const useSatelliteData = () => useMockQuery(getSatelliteData);
export const useAviationData = () => useMockQuery(getAviationData);
export const useAnalyticsData = () => useMockQuery(getAnalyticsData);
export const useAdminData = () => useMockQuery(getAdminData);
export const useProfileData = () => useMockQuery(getProfileData);

// hooks/useApiCache.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsApi, vulnerabilitiesApi, dashboardApi, assetDashboardApi } from "../services/api";
import { Asset, Vulnerability, DashboardSummary } from "../types";

// Cache keys
export const CACHE_KEYS = {
  ASSETS: "assets",
  ASSET: "asset",
  VULNERABILITIES: "vulnerabilities",
  VULNERABILITY: "vulnerability",
  DASHBOARD: "dashboard",
} as const;

// ✅ Dashboard hook
export const useDashboardData = () => {
  return useQuery<DashboardSummary>({
    queryKey: [CACHE_KEYS.DASHBOARD],
    queryFn: () => dashboardApi.getDashboard(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

// ✅ Assets hooks
export const useAssets = (params?: { search?: string; page?: number; limit?: number }) => {
  return useQuery<{ data: Asset[]; pagination: any }>({
    queryKey: [CACHE_KEYS.ASSETS, params],
    queryFn: () => assetsApi.getAssets(params),
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchOnWindowFocus: true,
  });
};

export const useAllAssets = () => {
  return useQuery<Asset[]>({
    queryKey: [CACHE_KEYS.ASSETS, "all"],
    queryFn: () => assetsApi.getAllAssets(),
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchOnWindowFocus: true,
  });
};

export const useAsset = (id: string, enabled = true) => {
  return useQuery<Asset>({
    queryKey: [CACHE_KEYS.ASSET, id],
    queryFn: () => assetsApi.getAsset(id),
    enabled: enabled && !!id,
  });
};

// ✅ Vulnerabilities hooks - Updated for paginated response
export const useVulnerabilities = (params?: { 
  search?: string; 
  severity?: string; 
  status?: string; 
  page?: number; 
  limit?: number 
}) => {
  return useQuery<{ data: Vulnerability[]; pagination: any }>({
    queryKey: [CACHE_KEYS.VULNERABILITIES, params],
    queryFn: () => vulnerabilitiesApi.getVulnerabilities(params),
  });
};

export const useVulnerability = (id: number, enabled = true) => {
  return useQuery<Vulnerability>({
    queryKey: [CACHE_KEYS.VULNERABILITY, id],
    queryFn: () => vulnerabilitiesApi.getVulnerability(id),
    enabled: enabled && !!id,
  });
};

export const useVulnerabilitiesSummary = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.VULNERABILITIES, "summary"],
    queryFn: () => vulnerabilitiesApi.getVulnerabilitiesSummary(),
  });
};

// Asset Dashboard hooks
export const useAssetDashboardMetrics = () => {
  return useQuery({
    queryKey: ['asset-dashboard', 'metrics'],
    queryFn: assetDashboardApi.getMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAssetTypesDistribution = () => {
  return useQuery({
    queryKey: ['asset-dashboard', 'types-distribution'],
    queryFn: assetDashboardApi.getAssetTypesDistribution,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRiskDistribution = () => {
  return useQuery({
    queryKey: ['asset-dashboard', 'risk-distribution'],
    queryFn: assetDashboardApi.getRiskDistribution,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCloudStatus = () => {
  return useQuery({
    queryKey: ['asset-dashboard', 'cloud-status'],
    queryFn: assetDashboardApi.getCloudStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentActivity = (timeframe: string = "7d") => {
  return useQuery({
    queryKey: ['asset-dashboard', 'recent-activity', timeframe],
    queryFn: () => assetDashboardApi.getRecentActivity(timeframe),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useQuickStatistics = () => {
  return useQuery({
    queryKey: ['asset-dashboard', 'quick-statistics'],
    queryFn: assetDashboardApi.getQuickStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

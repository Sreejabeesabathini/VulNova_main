// hooks/useApiCache.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsApi, vulnerabilitiesApi, dashboardApi } from "../services/api";
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
  return useQuery<Asset[]>({
    queryKey: [CACHE_KEYS.ASSETS, params],
    queryFn: () => assetsApi.getAssets(params),
  });
};

export const useAsset = (id: string, enabled = true) => {
  return useQuery<Asset>({
    queryKey: [CACHE_KEYS.ASSET, id],
    queryFn: () => assetsApi.getAsset(id),
    enabled: enabled && !!id,
  });
};

// ✅ Vulnerabilities hook
export const useVulnerabilities = () => {
  return useQuery<Vulnerability[]>({
    queryKey: [CACHE_KEYS.VULNERABILITIES],
    queryFn: () => vulnerabilitiesApi.getVulnerabilities(),
  });
};

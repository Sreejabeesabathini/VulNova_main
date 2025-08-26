import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { assetsApi, vulnerabilitiesApi, threatIntelligenceApi, dashboardApi } from '../services/api';

// Cache keys for consistent query invalidation
export const CACHE_KEYS = {
  ASSETS: 'assets',
  ASSET: 'asset',
  VULNERABILITIES: 'vulnerabilities',
  VULNERABILITY: 'vulnerability',
  THREAT_INTELLIGENCE: 'threatIntelligence',
  DASHBOARD: 'dashboard',
  REPORTS: 'reports',
  INTEGRATIONS: 'integrations',
  SOFTWARE_INVENTORY: 'softwareInventory',
  SUPPORT: 'support',
} as const;

// Custom hook for assets with enhanced caching
export const useAssets = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  assetType?: string;
  risk?: string;
}) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ASSETS, params],
    queryFn: () => assetsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Custom hook for single asset with caching
export const useAsset = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ASSET, id],
    queryFn: () => assetsApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,    // 15 minutes
  });
};

// Custom hook for vulnerabilities with caching
export const useVulnerabilities = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  severity?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [CACHE_KEYS.VULNERABILITIES, params],
    queryFn: () => vulnerabilitiesApi.getAll(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 8 * 60 * 1000,    // 8 minutes
    refetchOnWindowFocus: false,
  });
};

// Custom hook for dashboard data with caching
export const useDashboardData = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.DASHBOARD, 'summary'],
    queryFn: () => dashboardApi.getSummary(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
    refetchOnWindowFocus: true, // Dashboard should refresh on focus
  });
};

// Custom hook for riskiest assets with caching
export const useRiskiestAssets = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.DASHBOARD, 'riskiest-assets'],
    queryFn: () => dashboardApi.getRiskiestAssets(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 8 * 60 * 1000,    // 8 minutes
  });
};

// Custom hook for recent vulnerabilities with caching
export const useRecentVulnerabilities = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.DASHBOARD, 'recent-vulnerabilities'],
    queryFn: () => dashboardApi.getRecentVulnerabilities(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });
};

// Custom hook for threat intelligence with caching
export const useThreatIntelligence = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  severity?: string;
  source?: string;
}) => {
  return useQuery({
    queryKey: [CACHE_KEYS.THREAT_INTELLIGENCE, params],
    queryFn: () => threatIntelligenceApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Mutation hooks with cache invalidation
export const useAssetMutation = () => {
  const queryClient = useQueryClient();
  
  const createAsset = useMutation({
    mutationFn: assetsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ASSETS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.DASHBOARD] });
    },
  });

  const updateAsset = useMutation({
    mutationFn: ({ id, asset }: { id: string; asset: any }) => assetsApi.update(id, asset),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ASSETS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ASSET, id] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.DASHBOARD] });
    },
  });

  const deleteAsset = useMutation({
    mutationFn: assetsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.ASSETS] });
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.DASHBOARD] });
    },
  });

  return { createAsset, updateAsset, deleteAsset };
};

// Prefetch hook for better UX
export const usePrefetchAsset = () => {
  const queryClient = useQueryClient();
  
  const prefetchAsset = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: [CACHE_KEYS.ASSET, id],
      queryFn: () => assetsApi.getById(id),
      staleTime: 10 * 60 * 1000,
    });
  };

  return { prefetchAsset };
};

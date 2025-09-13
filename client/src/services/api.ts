// src/services/api.ts
import apiClient from "./client";
import { Asset, Vulnerability, DashboardSummary, ThreatIntelligence, VulnerabilitySummary } from "../types";

// ---------------- Dashboard API ----------------
export const dashboardApi = {
  getDashboard: async (): Promise<DashboardSummary> => {
    console.log("🔄 Fetching dashboard data...");
    try {
      const res = await apiClient.get("/dashboard-summary");
      console.log("✅ Dashboard data received:", res.data);
      return res.data.data; // ✅ unwrap inner "data"
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      throw error;
    }
  },
  getRiskiestAssets: async (): Promise<Asset[]> => {
    console.log("🔄 Fetching riskiest assets...");
    try {
      const res = await apiClient.get("/riskiest-assets");
      console.log("✅ Riskiest assets received:", res.data);
      return res.data.data; // ✅ unwrap inner "data"
    } catch (error) {
      console.error("❌ Error fetching riskiest assets:", error);
      throw error;
    }
  },
  getRecentVulnerabilities: async (): Promise<Vulnerability[]> => {
    console.log("🔄 Fetching recent vulnerabilities...");
    try {
      const res = await apiClient.get("/recent-vulnerabilities");
      console.log("✅ Recent vulnerabilities received:", res.data);
      return res.data.data; // ✅ unwrap inner "data"
    } catch (error) {
      console.error("❌ Error fetching recent vulnerabilities:", error);
      throw error;
    }
  },
  getThreatIntelligence: async (): Promise<ThreatIntelligence[]> => {
    console.log("🔄 Fetching threat intelligence...");
    try {
      const res = await apiClient.get("/threat-intelligence");
      console.log("✅ Threat intelligence received:", res.data);
      return res.data.data; // ✅ unwrap inner "data"
    } catch (error) {
      console.error("❌ Error fetching threat intelligence:", error);
      throw error;
    }
  },
};

// ---------------- Support API ----------------
export const supportApi = {
  getSummary: async (): Promise<{ total: number; open: number; inProgress: number; resolved: number }> => {
    const res = await apiClient.get("/support-summary");
    return res.data.data;
  },
  getTickets: async (params?: { search?: string; category?: string; priority?: string; status?: string; page?: number; limit?: number }): Promise<{ data: any[]; pagination: any }> => {
    const res = await apiClient.get("/support-tickets", { params });
    return res.data;
  },
  getKnowledgeArticles: async (params?: { search?: string; category?: string; page?: number; limit?: number }): Promise<{ data: any[]; pagination: any }> => {
    const res = await apiClient.get("/knowledge-articles", { params });
    return res.data;
  },
  getSupportChannels: async (): Promise<any[]> => {
    const res = await apiClient.get("/support-channels");
    return res.data.data;
  },
};

// ---------------- Threat Intel API ----------------
export const threatIntelApi = {
  getSummary: async (): Promise<{ total: number; active: number; critical: number; contained: number }> => {
    const res = await apiClient.get("/threats-summary");
    return res.data.data;
  },
  getTrends: async (): Promise<{ malware: any; phishing: any; ransomware: any; apt: any }> => {
    const res = await apiClient.get("/threats-trends");
    return res.data.data;
  },
  getThreats: async (params?: { search?: string; severity?: string; type?: string; status?: string; page?: number; limit?: number }): Promise<{ data: any[]; pagination: any }> => {
    const res = await apiClient.get("/threats", { params });
    return res.data;
  },
};

// ---------------- Vulnerabilities API ----------------
export const vulnerabilitiesApi = {
  getVulnerabilitiesSummary: async (): Promise<VulnerabilitySummary> => {
    const res = await apiClient.get("/vulnerabilities-summary");
    return res.data.data;
  },
  
  getVulnerabilities: async (
    params?: { 
      search?: string; 
      severity?: string; 
      status?: string; 
      page?: number; 
      limit?: number 
    }
  ): Promise<{ data: any[]; pagination: any }> => {
    const res = await apiClient.get("/vulnerabilities", { params });
    return res.data;
  },
  
  getVulnerability: async (id: number): Promise<Vulnerability> => {
    const res = await apiClient.get(`/vulnerabilities/${id}`);
    return res.data.data;
  },
  
  createVulnerability: async (vulnerabilityData: Partial<Vulnerability>): Promise<any> => {
    const res = await apiClient.post("/vulnerabilities", vulnerabilityData);
    return res.data;
  },
  
  updateVulnerability: async (id: number, vulnerabilityData: Partial<Vulnerability>): Promise<any> => {
    const res = await apiClient.put(`/vulnerabilities/${id}`, vulnerabilityData);
    return res.data;
  },
  
  deleteVulnerability: async (id: number): Promise<any> => {
    const res = await apiClient.delete(`/vulnerabilities/${id}`);
    return res.data;
  },
  
  scanVulnerabilities: async (): Promise<any> => {
    const res = await apiClient.post("/vulnerabilities/scan");
    return res.data;
  },
  
  exportVulnerabilities: async (
    params?: { 
      format?: string; 
      severity?: string; 
      status?: string 
    }
  ): Promise<any> => {
    const res = await apiClient.get("/vulnerabilities/export", { params });
    return res.data;
  },
};

// ---------------- Assets API ----------------
export const assetsApi = {
  getAssets: async (
    params?: { search?: string; page?: number; limit?: number }
  ): Promise<{ data: Asset[]; pagination: any }> => {
    const res = await apiClient.get("/assets", { params });
    return res.data; // Return the full response with data and pagination
  },
  
  getAllAssets: async (): Promise<Asset[]> => {
    // Fetch all assets by getting all pages
    const allAssets: Asset[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const res = await apiClient.get("/assets", { 
        params: { page, limit: 100 } 
      });
      const { data, pagination } = res.data;
      allAssets.push(...data);
      
      hasMore = page < pagination.totalPages;
      page++;
    }
    
    return allAssets;
  },
  getAsset: async (id: string): Promise<Asset> => {
    const res = await apiClient.get(`/assets/${id}`);
    return res.data.data; // ✅ unwrap inner "data"
  },
};

// ---------------- Asset Dashboard API ----------------
export const assetDashboardApi = {
  getMetrics: async () => {
    const res = await apiClient.get("/asset-dashboard-metrics");
    return res.data;
  },

  getAssetTypesDistribution: async () => {
    const res = await apiClient.get("/asset-types-distribution");
    return res.data;
  },

  getRiskDistribution: async () => {
    const res = await apiClient.get("/risk-distribution");
    return res.data;
  },

  getCloudStatus: async () => {
    const res = await apiClient.get("/cloud-status");
    return res.data;
  },

  getRecentActivity: async (timeframe: string = "7d") => {
    const res = await apiClient.get("/recent-activity", {
      params: { timeframe }
    });
    return res.data;
  },

  getQuickStatistics: async () => {
    const res = await apiClient.get("/quick-statistics");
    return res.data;
  },
};


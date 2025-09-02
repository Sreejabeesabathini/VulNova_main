// src/services/api.ts
import apiClient from "./client";
import { Asset, Vulnerability, DashboardSummary, ThreatIntelligence } from "../types";

// ---------------- Dashboard API ----------------
export const dashboardApi = {
  getDashboard: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get("/dashboard-summary");
    return res.data.data; // ✅ unwrap inner "data"
  },
  getRiskiestAssets: async (): Promise<Asset[]> => {
    const res = await apiClient.get("/riskiest-assets");
    return res.data.data; // ✅ unwrap inner "data"
  },
  getRecentVulnerabilities: async (): Promise<Vulnerability[]> => {
    const res = await apiClient.get("/recent-vulnerabilities");
    return res.data.data; // ✅ unwrap inner "data"
  },
  getThreatIntelligence: async (): Promise<ThreatIntelligence[]> => {
    const res = await apiClient.get("/threat-intelligence");
    return res.data.data; // ✅ unwrap inner "data"
  },
};

// ---------------- Assets API ----------------
export const assetsApi = {
  getAssets: async (
    params?: { search?: string; page?: number; limit?: number }
  ): Promise<Asset[]> => {
    const res = await apiClient.get("/assets", { params });
    return res.data.data; // ✅ unwrap inner "data"
  },
  getAsset: async (id: string): Promise<Asset> => {
    const res = await apiClient.get(`/assets/${id}`);
    return res.data.data; // ✅ unwrap inner "data"
  },
};

// ---------------- Vulnerabilities API ----------------
export const vulnerabilitiesApi = {
  getVulnerabilities: async (
    params?: { severity?: string; page?: number; limit?: number }
  ): Promise<Vulnerability[]> => {
    const res = await apiClient.get("/vulnerabilities", { params });
    return res.data.data; // ✅ unwrap inner "data"
  },
  getVulnerability: async (id: string): Promise<Vulnerability> => {
    const res = await apiClient.get(`/vulnerabilities/${id}`);
    return res.data.data; // ✅ unwrap inner "data"
  },
};

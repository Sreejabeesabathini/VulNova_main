// --- Core Data Interfaces ---
export interface Vulnerability {
  id: string;
  cve_id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  discovered_at: string;
}

// types.ts

export interface Asset {
  id: string;
  name: string;
  ip_address: string;
  location: string;
  asset_type: string;
  risk_score: number;
  critical_vulns: number;
  high_vulns: number;
  medium_vulns: number;
  low_vulns: number;
  last_seen: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  tags?: string[];
  integrations?: string[];
}

// Dashboard summary (as API returns it)
// src/types.ts
export interface DashboardSummary {
  totalAssets: number;
  total_threats: number;   
  risk_score: number;      
  vulnerabilities: {
    critical_vulns: number;
    high_vulns: number;
    medium_vulns: number;
    low_vulns: number;
  };
}

export interface ThreatIntelligence {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  date: string;
}
// --- API Response Interfaces ---
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Dashboard API Responses ---
export type DashboardSummaryResponse = ApiResponse<DashboardSummary>;
export type RiskiestAssetsResponse = ApiResponse<Asset[]>;
export type RecentVulnerabilitiesResponse = ApiResponse<Vulnerability[]>;
export type ThreatIntelligenceResponse = ApiResponse<ThreatIntelligence[]>;

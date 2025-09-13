// --- Core Data Interfaces ---
export interface Vulnerability {
  // Primary key
  id?: number;
  
  // Core vulnerability fields (standalone)
  vuln_identifier?: string;
  name?: string;
  cve?: string;
  cwe?: string;
  owasp?: string;
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  cvss_v3_base?: number;
  risk_factor?: string;
  epss?: number;
  description?: string;
  remediation?: string;
  reference?: string;
  solution?: string;
  source?: string;

  // For single vulnerability view - includes affected assets
  affected_assets?: AssetVulnerability[];
}

export interface AssetVulnerability {
  // Junction table fields
  av_id?: number;
  asset_id?: number;
  vuln_id?: number;
  status?: 'Open' | 'In Progress' | 'Resolved' | 'False Positive' | 'Muted' | 'Accepted Risk' | 'Fixed';
  first_seen?: string;
  last_seen?: string;
  evidence?: string;
  plugin_output?: string;
  code_snippet?: string;
  context_repo?: string;
  context_project?: string;
  context_file_path?: string;
  context_line?: string;
  context_url?: string;
  tool_vuln_id?: string;

  // Vulnerability details (from JOIN)
  vuln_identifier?: string;
  vuln_name?: string;
  cve?: string;
  cwe?: string;
  owasp?: string;
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  cvss_v3_base?: number;
  risk_factor?: string;
  epss?: number;
  vuln_description?: string;
  remediation?: string;
  reference?: string;
  solution?: string;
  vuln_source?: string;

  // Asset details (from JOIN)
  asset_name?: string;
  ip_address?: string;
  fqdn?: string;
  asset_type?: string;
  environment?: string;
  criticality?: string;
  region_or_site?: string;
  owner?: string;
  tags?: string;
}

export interface Asset {
  id: number;
  external_id: string;
  source: string;
  asset_name?: string;
  fqdn?: string;
  ip_address?: string;
  asset_type?: string;
  environment?: string;
  owner?: string;
  criticality?: string;
  region_or_site?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
  last_seen?: string;

  // Computed fields from vulnerability counts
  total_vulns?: number;
  critical_vulns?: number;
  high_vulns?: number;
  medium_vulns?: number;
  low_vulns?: number;
  risk_score?: number;
}

// Dashboard summary (as API returns it)
export interface DashboardSummary {
  totalAssets: number;
  totalThreats: number;
  riskScore: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

// Vulnerability summary (as API returns it)
export interface VulnerabilitySummary {
  severity: {
    critical: {
      count: number;
      description: string;
      priority: string;
    };
    high: {
      count: number;
      description: string;
      priority: string;
    };
    medium: {
      count: number;
      description: string;
      priority: string;
    };
    low: {
      count: number;
      description: string;
      priority: string;
    };
  };
  status: {
    open: number;
    inProgress: number;
    resolved: number;
    falsePositive: number;
    muted: number;
    acceptedRisk: number;
    fixed: number;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Filter and search types
export interface VulnerabilityFilters {
  severity?: string;
  status?: string;
  asset_id?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AssetFilters {
  asset_type?: string;
  environment?: string;
  criticality?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Threat Intelligence types
export interface ThreatIntelligence {
  id: number;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  date: string;
  status: 'active' | 'inactive';
  created_at: string;
}

// Support types
export interface SupportTicket {
  id: number;
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  category: 'Technical' | 'Billing' | 'Feature Request' | 'Bug Report' | 'General';
  assigned_to: string;
  created_at: string;
  updated_at: string;
  response_time: string;
}

export interface KnowledgeArticle {
  id: number;
  title: string;
  category: string;
  tags: string[];
  last_updated: string;
  views: number;
  helpful: number;
  created_at: string;
}
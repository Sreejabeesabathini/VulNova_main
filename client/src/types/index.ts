// Core data interfaces
export interface Vulnerability {
  _id: string;
  cveId: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cvssScore: number;
  affectedAssets: string[];
  status: 'Open' | 'In Progress' | 'Resolved' | 'False Positive';
  discoveredDate: string;
  lastModified: string;
  remediation: string;
  references: string[];
}

export interface Asset {
  _id: string;
  name: string;
  ipAddress: string;
  location: string;
  assetType: string;
  riskScore: number;
  criticalVulns: number;
  highVulns: number;
  mediumVulns: number;
  lowVulns: number;
  lastSeen: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  tags: string[];
  integrations: string[];
}

export interface ThreatIntelligence {
  _id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  date: string;
  affectedAssets: string[];
  ioc: string[];
  mitigation: string;
}

export interface DashboardSummary {
  riskScore: number;
  riskStatus: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  totalAssets: number;
  totalThreats: number;
}

export interface Integration {
  _id: string;
  name: string;
  type: 'EDR' | 'EDP' | 'LDAP' | 'Custom';
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  config: Record<string, any>;
}

export interface Report {
  _id: string;
  title: string;
  type: 'Vulnerability' | 'Asset' | 'Threat' | 'Compliance';
  generatedDate: string;
  status: 'Draft' | 'Generated' | 'Delivered';
  data: Record<string, any>;
}

// API response interfaces
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Component props interfaces
export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  pagination?: boolean;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

// Form interfaces
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'date';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormData {
  [key: string]: any;
}

// Navigation interfaces
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

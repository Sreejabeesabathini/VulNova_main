import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Vulnerability,
  Asset,
  ThreatIntelligence,
  DashboardSummary,
  Integration,
  Report,
  ApiResponse,
  PaginatedResponse
} from '../types';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardApi = {
  getSummary: (): Promise<ApiResponse<DashboardSummary>> =>
    api.get('/dashboard-summary').then(res => res.data),
  
  getRiskiestAssets: (): Promise<ApiResponse<Asset[]>> =>
    api.get('/riskiest-assets').then(res => res.data),
  
  getRecentVulnerabilities: (): Promise<ApiResponse<Vulnerability[]>> =>
    api.get('/recent-vulnerabilities').then(res => res.data),
  
  getThreatIntelligence: (): Promise<ApiResponse<ThreatIntelligence[]>> =>
    api.get('/threat-intelligence').then(res => res.data),
};

// Assets API
export const assetsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    assetType?: string;
    risk?: string;
  }): Promise<PaginatedResponse<Asset>> =>
    api.get('/assets', { params }).then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<Asset>> =>
    api.get(`/assets/${id}`).then(res => res.data),
  
  create: (asset: Omit<Asset, '_id'>): Promise<ApiResponse<Asset>> =>
    api.post('/assets', asset).then(res => res.data),
  
  update: (id: string, asset: Partial<Asset>): Promise<ApiResponse<Asset>> =>
    api.put(`/assets/${id}`, asset).then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/assets/${id}`).then(res => res.data),
};

// Vulnerabilities API
export const vulnerabilitiesApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    severity?: string;
    status?: string;
  }): Promise<PaginatedResponse<Vulnerability>> =>
    api.get('/vulnerabilities', { params }).then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<Vulnerability>> =>
    api.get(`/vulnerabilities/${id}`).then(res => res.data),
  
  create: (vulnerability: Omit<Vulnerability, '_id'>): Promise<ApiResponse<Vulnerability>> =>
    api.post('/vulnerabilities', vulnerability).then(res => res.data),
  
  update: (id: string, vulnerability: Partial<Vulnerability>): Promise<ApiResponse<Vulnerability>> =>
    api.put(`/vulnerabilities/${id}`, vulnerability).then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/vulnerabilities/${id}`).then(res => res.data),
  
  getByCveId: (cveId: string): Promise<ApiResponse<Vulnerability>> =>
    api.get(`/vulnerabilities/cve/${cveId}`).then(res => res.data),
  
  getAffectedAssets: (id: string): Promise<ApiResponse<Asset[]>> =>
    api.get(`/vulnerabilities/${id}/affected-assets`).then(res => res.data),
};

// Threat Intelligence API
export const threatIntelligenceApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    severity?: string;
    source?: string;
  }): Promise<PaginatedResponse<ThreatIntelligence>> =>
    api.get('/threat-intelligence', { params }).then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<ThreatIntelligence>> =>
    api.get(`/threat-intelligence/${id}`).then(res => res.data),
  
  create: (threat: Omit<ThreatIntelligence, '_id'>): Promise<ApiResponse<ThreatIntelligence>> =>
    api.post('/threat-intelligence', threat).then(res => res.data),
  
  update: (id: string, threat: Partial<ThreatIntelligence>): Promise<ApiResponse<ThreatIntelligence>> =>
    api.put(`/threat-intelligence/${id}`, threat).then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/threat-intelligence/${id}`).then(res => res.data),
};

// Integrations API
export const integrationsApi = {
  getAll: (): Promise<PaginatedResponse<Integration>> =>
    api.get('/integrations').then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<Integration>> =>
    api.get(`/integrations/${id}`).then(res => res.data),
  
  create: (integration: Omit<Integration, '_id'>): Promise<ApiResponse<Integration>> =>
    api.post('/integrations', integration).then(res => res.data),
  
  update: (id: string, integration: Partial<Integration>): Promise<ApiResponse<Integration>> =>
    api.put(`/integrations/${id}`, integration).then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/integrations/${id}`).then(res => res.data),
  
  testConnection: (id: string): Promise<ApiResponse<{ status: string; message: string }>> =>
    api.post(`/integrations/${id}/test`).then(res => res.data),
  
  sync: (id: string): Promise<ApiResponse<{ status: string; message: string }>> =>
    api.post(`/integrations/${id}/sync`).then(res => res.data),
};

// Reports API
export const reportsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }): Promise<PaginatedResponse<Report>> =>
    api.get('/reports', { params }).then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<Report>> =>
    api.get(`/reports/${id}`).then(res => res.data),
  
  create: (report: Omit<Report, '_id'>): Promise<ApiResponse<Report>> =>
    api.post('/reports', report).then(res => res.data),
  
  update: (id: string, report: Partial<Report>): Promise<ApiResponse<Report>> =>
    api.put(`/reports/${id}`, report).then(res => res.data),
  
  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/reports/${id}`).then(res => res.data),
  
  generate: (id: string): Promise<ApiResponse<{ downloadUrl: string }>> =>
    api.post(`/reports/${id}/generate`).then(res => res.data),
  
  deliver: (id: string, deliveryConfig: any): Promise<ApiResponse<{ status: string }>> =>
    api.post(`/reports/${id}/deliver`, deliveryConfig).then(res => res.data),
};

export default api;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '../../services/api';
import { Asset, Vulnerability } from '../../types';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  Shield, 
  Server, 
  Monitor, 
  Database,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  User,
  Tag,
  Calendar,
  MapPin,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  HardDriveIcon,
  Wifi,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react';

const AssetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'activity' | 'integrations'>('overview');

  const { data: assetData, isLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => assetsApi.getById(id!),
    enabled: !!id,
  });

  const asset = assetData?.data;

  // Mock data for demonstration (in real app, this would come from API)
  const mockAsset: Asset = {
    _id: id || '1',
    name: 'Web Server - Production',
    ipAddress: '192.168.1.100',
    location: 'Data Center A - Rack 12',
    assetType: 'Server',
    riskScore: 85,
    criticalVulns: 3,
    highVulns: 7,
    mediumVulns: 12,
    lowVulns: 5,
    lastSeen: '2024-01-15T10:30:00Z',
    status: 'Active',
    tags: ['Production', 'Web Server', 'Critical', 'Internet Facing'],
    integrations: ['CrowdStrike EDR', 'Tenable Scanner', 'Active Directory']
  };

  const currentAsset = asset || mockAsset;

  const vulnerabilityData = [
    { severity: 'Critical', count: currentAsset.criticalVulns, color: 'bg-red-500' },
    { severity: 'High', count: currentAsset.highVulns, color: 'bg-orange-500' },
    { severity: 'Medium', count: currentAsset.mediumVulns, color: 'bg-yellow-500' },
    { severity: 'Low', count: currentAsset.lowVulns, color: 'bg-green-500' }
  ];

  const recentActivity = [
    { action: 'Vulnerability scan completed', time: '2 hours ago', status: 'completed' },
    { action: 'EDR agent updated', time: '1 day ago', status: 'updated' },
    { action: 'Security patch applied', time: '3 days ago', status: 'applied' },
    { action: 'Asset discovered', time: '1 week ago', status: 'discovered' }
  ];

  const integrationStatus = [
    { name: 'CrowdStrike EDR', status: 'Connected', lastSync: '2 minutes ago', icon: Shield },
    { name: 'Tenable Scanner', status: 'Connected', lastSync: '1 hour ago', icon: AlertTriangle },
    { name: 'Active Directory', status: 'Connected', lastSync: '5 minutes ago', icon: User }
  ];

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'Server':
        return Server;
      case 'Workstation':
        return Monitor;
      case 'Database':
        return Database;
      case 'Network Device':
        return Network;
      case 'Web Application':
        return Globe;
      default:
        return Server;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return CheckCircle;
      case 'Inactive':
        return Clock;
      case 'Maintenance':
        return Settings;
      default:
        return Clock;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskStatus = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const handleEdit = () => {
    alert('Edit asset form will open...');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      alert('Asset deletion initiated...');
      navigate('/assets');
    }
  };

  const handleScan = () => {
    alert('Initiating vulnerability scan...');
  };

  const handleExport = () => {
    alert('Exporting asset details...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentAsset) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Asset Not Found</h2>
        <p className="text-gray-600 mb-6">The requested asset could not be found.</p>
        <button
          onClick={() => navigate('/assets')}
          className="btn-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assets
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/assets')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentAsset.name}</h1>
            <p className="text-gray-600">Asset Details & Management</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleScan}
            className="btn-secondary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Scan Asset
          </button>
          <button
            onClick={handleEdit}
            className="btn-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Asset
          </button>
          <button
            onClick={handleExport}
            className="btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={handleDelete}
            className="btn-danger"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Asset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
              {React.createElement(getAssetTypeIcon(currentAsset.assetType), { className: "w-6 h-6 text-primary-600" })}
            </div>
            <span className={`text-2xl font-bold ${getRiskColor(currentAsset.riskScore)}`}>
              {currentAsset.riskScore}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Risk Score</h3>
          <p className="text-sm text-gray-600">{getRiskStatus(currentAsset.riskScore)} Risk</p>
          <div className="mt-2 text-xs text-gray-500">Last updated: {new Date(currentAsset.lastSeen).toLocaleDateString()}</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{currentAsset.criticalVulns}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Critical Vulnerabilities</h3>
          <p className="text-sm text-gray-600">Immediate attention required</p>
          <div className="mt-2 text-xs text-red-600">High priority</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{currentAsset.integrations.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Integrations</h3>
          <p className="text-sm text-gray-600">Security tools connected</p>
          <div className="mt-2 text-xs text-blue-600">Monitoring enabled</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentAsset.status)}`}>
              {React.createElement(getStatusIcon(currentAsset.status), { className: "w-4 h-4 mr-2" })}
              {currentAsset.status}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Asset Status</h3>
          <p className="text-sm text-gray-600">Current operational state</p>
          <div className="mt-2 text-xs text-gray-500">Last seen: {new Date(currentAsset.lastSeen).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Asset Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-primary-800">Asset Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Asset Name</label>
                <p className="text-sm text-gray-900">{currentAsset.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">IP Address</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <Network className="w-4 h-4 mr-2 text-gray-400" />
                  {currentAsset.ipAddress}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {currentAsset.location}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Asset Type</label>
                <p className="text-sm text-gray-900 flex items-center">
                  {React.createElement(getAssetTypeIcon(currentAsset.assetType), { className: "w-4 h-4 mr-2 text-gray-400" })}
                  {currentAsset.assetType}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentAsset.status)}`}>
                    {React.createElement(getStatusIcon(currentAsset.status), { className: "w-4 h-4 mr-2" })}
                    {currentAsset.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Seen</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {new Date(currentAsset.lastSeen).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentAsset.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-primary-800">Vulnerability Summary</h2>
          <div className="space-y-4">
            {vulnerabilityData.map((vuln) => (
              <div key={vuln.severity} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${vuln.color}`}></div>
                  <span className="font-medium">{vuln.severity}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{vuln.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vulnerabilities'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Vulnerabilities ({currentAsset.criticalVulns + currentAsset.highVulns + currentAsset.mediumVulns + currentAsset.lowVulns})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Activity
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'integrations'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Integrations
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          activity.status === 'updated' ? 'bg-blue-100 text-blue-800' : 
                          activity.status === 'applied' ? 'bg-purple-100 text-purple-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.status}
                        </span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Run Vulnerability Scan</span>
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Update Asset Information</span>
                      <Edit className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Generate Report</span>
                      <Download className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vulnerabilities' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-800">
                  {currentAsset.criticalVulns} critical vulnerabilities require immediate attention
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Vulnerability Details</h3>
              </div>
              <div className="p-6 text-center text-gray-500">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p>Vulnerability details will be displayed here</p>
                <p className="text-sm">This would show a detailed list of all vulnerabilities found on this asset</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Asset Activity Timeline</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Integration Status</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {integrationStatus.map((integration, index) => {
                    const Icon = integration.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-primary-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                            <p className="text-xs text-gray-500">Last sync: {integration.lastSync}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {integration.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDetails;

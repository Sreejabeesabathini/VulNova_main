import React, { useState } from 'react';
import { 
  Shield, 
  Server, 
  Database, 
  Network, 
  Globe, 
  Plus, 
  Settings, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Link,
  Download,
  Upload,
  Activity,
  Zap,
  Lock,
  Unlock,
  Search
} from 'lucide-react';

interface Integration {
  _id: string;
  name: string;
  type: 'EDR' | 'Scanner' | 'SIEM' | 'Firewall' | 'Database' | 'Cloud' | 'Custom';
  status: 'Connected' | 'Disconnected' | 'Error' | 'Pending';
  lastSync: string;
  syncStatus: 'Success' | 'Failed' | 'In Progress' | 'Pending';
  health: 'Healthy' | 'Warning' | 'Critical' | 'Unknown';
  version: string;
  description: string;
  endpoints: number;
  dataSources: string[];
}

const Integrations: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data for demonstration
  const mockIntegrations: Integration[] = [
    {
      _id: '1',
      name: 'CrowdStrike EDR',
      type: 'EDR',
      status: 'Connected',
      lastSync: '2 minutes ago',
      syncStatus: 'Success',
      health: 'Healthy',
      version: '6.45.0',
      description: 'Endpoint Detection and Response platform for threat detection and response',
      endpoints: 1247,
      dataSources: ['Process Events', 'Network Events', 'File Events', 'Registry Events']
    },
    {
      _id: '2',
      name: 'Tenable Nessus',
      type: 'Scanner',
      status: 'Connected',
      lastSync: '1 hour ago',
      syncStatus: 'Success',
      health: 'Healthy',
      version: '10.5.0',
      description: 'Vulnerability scanner for comprehensive security assessment',
      endpoints: 856,
      dataSources: ['Vulnerability Scans', 'Compliance Checks', 'Asset Discovery']
    },
    {
      _id: '3',
      name: 'Splunk Enterprise',
      type: 'SIEM',
      status: 'Connected',
      lastSync: '5 minutes ago',
      syncStatus: 'Success',
      health: 'Warning',
      version: '9.0.0',
      description: 'Security Information and Event Management platform',
      endpoints: 2341,
      dataSources: ['Log Events', 'Security Events', 'Performance Metrics']
    },
    {
      _id: '4',
      name: 'Palo Alto Firewall',
      type: 'Firewall',
      status: 'Connected',
      lastSync: '15 minutes ago',
      syncStatus: 'Success',
      health: 'Healthy',
      version: '10.2.0',
      description: 'Next-generation firewall with advanced threat prevention',
      endpoints: 45,
      dataSources: ['Network Traffic', 'Threat Logs', 'Policy Violations']
    },
    {
      _id: '5',
      name: 'Active Directory',
      type: 'Database',
      status: 'Connected',
      lastSync: '1 minute ago',
      syncStatus: 'Success',
      health: 'Healthy',
      version: '2019',
      description: 'Microsoft directory service for identity management',
      endpoints: 0,
      dataSources: ['User Accounts', 'Group Memberships', 'Authentication Events']
    },
    {
      _id: '6',
      name: 'AWS CloudTrail',
      type: 'Cloud',
      status: 'Connected',
      lastSync: '30 minutes ago',
      syncStatus: 'Success',
      health: 'Healthy',
      version: 'N/A',
      description: 'AWS service for monitoring and logging account activity',
      endpoints: 0,
      dataSources: ['API Calls', 'Management Events', 'Data Events']
    }
  ];

  const filteredIntegrations = mockIntegrations.filter(integration => {
    const matchesType = selectedType === 'all' || integration.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || integration.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EDR':
        return Shield;
      case 'Scanner':
        return Search;
      case 'SIEM':
        return Activity;
      case 'Firewall':
        return Lock;
      case 'Database':
        return Database;
      case 'Cloud':
        return Globe;
      case 'Custom':
        return Settings;
      default:
        return Link;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Disconnected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Unknown':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return CheckCircle;
      case 'Failed':
        return XCircle;
      case 'In Progress':
        return RefreshCw;
      case 'Pending':
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'text-green-600';
      case 'Failed':
        return 'text-red-600';
      case 'In Progress':
        return 'text-blue-600';
      case 'Pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const integrationTypes = ['all', 'EDR', 'Scanner', 'SIEM', 'Firewall', 'Database', 'Cloud', 'Custom'];
  const integrationStatuses = ['all', 'Connected', 'Disconnected', 'Error', 'Pending'];

  const summaryData = {
    total: mockIntegrations.length,
    connected: mockIntegrations.filter(i => i.status === 'Connected').length,
    healthy: mockIntegrations.filter(i => i.health === 'Healthy').length,
    errors: mockIntegrations.filter(i => i.status === 'Error' || i.health === 'Critical').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
            <p className="text-gray-600">Manage and monitor security tool integrations across your infrastructure</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Sync All</span>
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Integration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integration Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{summaryData.total}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Integrations</h3>
          <p className="text-sm text-gray-600">All connected tools</p>
          <div className="mt-2 text-xs text-blue-600">Active connections</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{summaryData.connected}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Connected</h3>
          <p className="text-sm text-gray-600">Active integrations</p>
          <div className="mt-2 text-xs text-green-600">Online</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{summaryData.healthy}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Healthy</h3>
          <p className="text-sm text-gray-600">Good status</p>
          <div className="mt-2 text-xs text-green-600">Optimal</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{summaryData.errors}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Issues</h3>
          <p className="text-sm text-gray-600">Need attention</p>
          <div className="mt-2 text-xs text-red-600">Action required</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              {integrationTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              {integrationStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const TypeIcon = getTypeIcon(integration.type);
          const SyncStatusIcon = getSyncStatusIcon(integration.syncStatus);
          
          return (
            <div key={integration._id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Integration Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
                      {integration.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getHealthColor(integration.health)}`}>
                      {integration.health}
                    </span>
                  </div>
                </div>

                {/* Integration Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{integration.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Version:</span>
                      <span className="font-medium">{integration.version}</span>
                    </div>
                    {integration.endpoints > 0 && (
                      <div className="flex items-center justify-between">
                        <span>Endpoints:</span>
                        <span className="font-medium">{integration.endpoints}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sync Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Last Sync</span>
                    <div className="flex items-center space-x-1">
                      <SyncStatusIcon className={`w-4 h-4 ${getSyncStatusColor(integration.syncStatus)}`} />
                      <span className={`text-xs font-medium ${getSyncStatusColor(integration.syncStatus)}`}>
                        {integration.syncStatus}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{integration.lastSync}</div>
                </div>

                {/* Data Sources */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Data Sources</h4>
                  <div className="flex flex-wrap gap-1">
                    {integration.dataSources.slice(0, 3).map((source, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {source}
                      </span>
                    ))}
                    {integration.dataSources.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{integration.dataSources.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Settings className="w-4 h-4 inline mr-1" />
                    Configure
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Activity className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Link className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filter criteria.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Add First Integration
          </button>
        </div>
      )}
    </div>
  );
};

export default Integrations;

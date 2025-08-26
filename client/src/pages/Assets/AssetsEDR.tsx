import React, { useState } from 'react';
import { 
  RefreshCw, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Settings, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Shield,
  Server,
  Monitor,
  Database,
  Network,
  Globe,
  Zap,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Info,
  Target,
  Users,
  HardDrive,
  Mail
} from 'lucide-react';

interface EDRPlatform {
  id: string;
  name: string;
  vendor: string;
  version: string;
  status: 'active' | 'inactive' | 'error';
  endpoints: number;
  lastSync: string;
  threats: number;
  incidents: number;
  avgResponseTime: string;
}

interface Threat {
  id: string;
  asset: string;
  type: 'malware' | 'ransomware' | 'phishing' | 'exploit' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  status: 'detected' | 'investigating' | 'contained' | 'resolved';
  source: string;
}

interface EDRAgent {
  id: string;
  asset: string;
  platform: string;
  status: 'online' | 'offline' | 'quarantined' | 'updating';
  lastSeen: string;
  version: string;
  health: 'healthy' | 'warning' | 'critical';
  threats: number;
}

const AssetsEDR: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockEDRPlatforms: EDRPlatform[] = [
    {
      id: '1',
      name: 'CrowdStrike Falcon',
      vendor: 'CrowdStrike',
      version: '6.45.0',
      status: 'active',
      endpoints: 456,
      lastSync: '2 minutes ago',
      threats: 23,
      incidents: 8,
      avgResponseTime: '2.3s'
    },
    {
      id: '2',
      name: 'SentinelOne',
      vendor: 'SentinelOne',
      version: '22.3.0',
      status: 'active',
      endpoints: 234,
      lastSync: '5 minutes ago',
      threats: 15,
      incidents: 5,
      avgResponseTime: '1.8s'
    },
    {
      id: '3',
      name: 'Carbon Black',
      vendor: 'VMware',
      version: '7.2.0',
      status: 'active',
      endpoints: 357,
      lastSync: '1 minute ago',
      threats: 12,
      incidents: 3,
      avgResponseTime: '3.1s'
    }
  ];

  const mockThreats: Threat[] = [
    {
      id: '1',
      asset: 'Workstation-45',
      type: 'malware',
      severity: 'critical',
      timestamp: '2024-01-15 10:30:00',
      description: 'Trojan detected attempting to establish C2 connection',
      status: 'investigating',
      source: 'CrowdStrike Falcon'
    },
    {
      id: '2',
      asset: 'Laptop-23',
      type: 'phishing',
      severity: 'high',
      timestamp: '2024-01-15 09:15:00',
      description: 'Suspicious email with malicious attachment blocked',
      status: 'contained',
      source: 'SentinelOne'
    },
    {
      id: '3',
      asset: 'Server-12',
      type: 'exploit',
      severity: 'medium',
      timestamp: '2024-01-15 08:45:00',
      description: 'Attempted privilege escalation detected',
      status: 'resolved',
      source: 'Carbon Black'
    }
  ];

  const mockEDRAgents: EDRAgent[] = [
    {
      id: '1',
      asset: 'Web-Server-01',
      platform: 'CrowdStrike Falcon',
      status: 'online',
      lastSeen: '2 minutes ago',
      version: '6.45.0',
      health: 'healthy',
      threats: 0
    },
    {
      id: '2',
      asset: 'Workstation-45',
      platform: 'SentinelOne',
      status: 'quarantined',
      lastSeen: '1 hour ago',
      version: '22.3.0',
      health: 'critical',
      threats: 3
    },
    {
      id: '3',
      asset: 'DB-Server-01',
      platform: 'Carbon Black',
      status: 'online',
      lastSeen: '5 minutes ago',
      version: '7.2.0',
      health: 'warning',
      threats: 1
    }
  ];

  const summaryData = {
    protectedEndpoints: 1089,
    activeThreats: 23,
    unprotectedAssets: 156,
    avgResponseTime: '2.3s'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return XCircle;
      case 'error': return AlertTriangle;
      default: return XCircle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatTypeIcon = (type: string) => {
    switch (type) {
      case 'malware': return Shield;
      case 'ransomware': return AlertTriangle;
      case 'phishing': return Mail;
      case 'exploit': return Target;
      case 'suspicious_activity': return Activity;
      default: return AlertCircle;
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'quarantined': return 'bg-red-100 text-red-800';
      case 'updating': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSyncAll = () => {
    alert('Syncing all EDR platforms...');
  };

  const handleAddEDR = () => {
    alert('Add EDR platform form will open...');
  };

  const handleEditPlatform = (platform: EDRPlatform) => {
    alert(`Edit platform: ${platform.name}`);
  };

  const handleDeletePlatform = (platform: EDRPlatform) => {
    if (window.confirm(`Are you sure you want to delete the EDR platform "${platform.name}"?`)) {
      alert(`Platform "${platform.name}" deleted`);
    }
  };

  const filteredPlatforms = mockEDRPlatforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedPlatform === 'all' || platform.status === selectedPlatform;
    return matchesSearch && matchesStatus;
  });

  const filteredThreats = mockThreats.filter(threat => {
    return selectedSeverity === 'all' || threat.severity === selectedSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Endpoint Detection & Response</h1>
            <p className="text-gray-600">Manage EDR platform integrations and endpoint security monitoring</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleSyncAll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync All</span>
            </button>
            <button 
              onClick={handleAddEDR}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add EDR</span>
            </button>
          </div>
        </div>
      </div>

      {/* EDR Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <ShieldCheck className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.protectedEndpoints}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Protected Endpoints</h3>
          <p className="text-sm text-gray-600">With active EDR</p>
          <div className="mt-2 text-xs text-green-600">87.3% coverage</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{summaryData.activeThreats}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Threats</h3>
          <p className="text-sm text-gray-600">Detected by EDR</p>
          <div className="mt-2 text-xs text-red-600">+5 in last hour</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.unprotectedAssets}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Unprotected Assets</h3>
          <p className="text-sm text-gray-600">Missing EDR coverage</p>
          <div className="mt-2 text-xs text-orange-600">Require attention</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.avgResponseTime}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Avg Response Time</h3>
          <p className="text-sm text-gray-600">Threat detection</p>
          <div className="mt-2 text-xs text-green-600">-0.8s improvement</div>
        </div>
      </div>

      {/* EDR Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Active EDR Connections */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active EDR Platforms</h2>
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-4">
            {mockEDRPlatforms.map((platform) => {
              const StatusIcon = getStatusIcon(platform.status);
              return (
                <div key={platform.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{platform.name}</h3>
                      <p className="text-xs text-gray-500">{platform.vendor} v{platform.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(platform.status)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {platform.status}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{platform.endpoints} endpoints</p>
                      <p className="text-xs text-gray-500">{platform.threats} threats</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Threats */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Threats</h2>
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="space-y-3">
            {mockThreats.slice(0, 3).map((threat) => (
              <div key={threat.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{threat.asset}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                    {threat.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{threat.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{threat.type.replace('_', ' ')}</span>
                  <span>{threat.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search EDR platforms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* EDR Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredPlatforms.map((platform) => {
          const StatusIcon = getStatusIcon(platform.status);
          return (
            <div key={platform.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Platform Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(platform.status)}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {platform.status}
                  </span>
                </div>

                {/* Platform Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{platform.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Vendor:</span>
                      <span className="font-medium">{platform.vendor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Version:</span>
                      <span className="font-medium">{platform.version}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Endpoints:</span>
                      <span className="font-medium">{platform.endpoints.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Threats:</span>
                      <span className="font-medium">{platform.threats}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">{platform.incidents}</div>
                      <div className="text-xs text-red-700">Incidents</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{platform.avgResponseTime}</div>
                      <div className="text-xs text-blue-700">Response</div>
                    </div>
                  </div>
                </div>

                {/* Last Sync */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last sync:</span>
                    <span>{platform.lastSync}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditPlatform(platform)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeletePlatform(platform)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDR Agents Status */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">EDR Agent Status</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Status</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Asset</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Platform</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Health</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Version</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Threats</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Seen</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockEDRAgents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{agent.asset}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{agent.platform}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAgentStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(agent.health)}`}>
                      {agent.health}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{agent.version}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{agent.threats}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{agent.lastSeen}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Threat Details */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Threat Details</h2>
          <div className="flex items-center space-x-2">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              <Download className="w-4 h-4 inline mr-1" />
              Export
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredThreats.map((threat) => (
            <div key={threat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  threat.severity === 'critical' ? 'bg-red-500' :
                  threat.severity === 'high' ? 'bg-orange-500' :
                  threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="flex items-center space-x-3">
                  {React.createElement(getThreatTypeIcon(threat.type), { className: "w-5 h-5 text-primary-600" })}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{threat.asset}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600 capitalize">{threat.type.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{threat.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">{threat.timestamp}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                    {threat.severity}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-sm font-medium text-gray-900">{threat.source}</p>
                </div>
                <button className="text-primary-600 hover:text-primary-800">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetsEDR;

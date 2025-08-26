import React, { useState } from 'react';
import { 
  RefreshCw, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  FileLock, 
  EyeOff, 
  Settings, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  BarChart3,
  Shield,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  Zap,
  Mail,
  Globe,
  Network
} from 'lucide-react';

interface EDPPlatform {
  id: string;
  name: string;
  vendor: string;
  version: string;
  status: 'active' | 'inactive' | 'error';
  endpoints: number;
  lastSync: string;
  policies: number;
  violations: number;
  dataProtected: string;
}

interface PolicyViolation {
  id: string;
  asset: string;
  policy: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
}

interface DLPPolicy {
  id: string;
  name: string;
  type: 'file' | 'email' | 'web' | 'device' | 'network';
  status: 'enabled' | 'disabled' | 'draft';
  priority: 'low' | 'medium' | 'high' | 'critical';
  endpoints: number;
  violations: number;
  lastModified: string;
}

const AssetsEDP: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockEDPPlatforms: EDPPlatform[] = [
    {
      id: '1',
      name: 'Symantec DLP',
      vendor: 'Broadcom',
      version: '15.8.0',
      status: 'active',
      endpoints: 456,
      lastSync: '2 minutes ago',
      policies: 23,
      violations: 12,
      dataProtected: '1.2TB'
    },
    {
      id: '2',
      name: 'Forcepoint DLP',
      vendor: 'Forcepoint',
      version: '8.5.0',
      status: 'active',
      endpoints: 234,
      lastSync: '5 minutes ago',
      policies: 18,
      violations: 8,
      dataProtected: '856GB'
    },
    {
      id: '3',
      name: 'Microsoft Purview',
      vendor: 'Microsoft',
      version: '2023',
      status: 'active',
      endpoints: 357,
      lastSync: '1 minute ago',
      policies: 31,
      violations: 15,
      dataProtected: '2.1TB'
    }
  ];

  const mockViolations: PolicyViolation[] = [
    {
      id: '1',
      asset: 'Workstation-45',
      policy: 'Sensitive Data Transfer',
      severity: 'critical',
      timestamp: '2024-01-15 10:30:00',
      description: 'Attempted to copy customer PII to external USB device',
      status: 'investigating'
    },
    {
      id: '2',
      asset: 'Laptop-23',
      policy: 'Email Content Filter',
      severity: 'high',
      timestamp: '2024-01-15 09:15:00',
      description: 'Email containing credit card numbers blocked',
      status: 'open'
    },
    {
      id: '3',
      asset: 'Server-12',
      policy: 'File Access Control',
      severity: 'medium',
      timestamp: '2024-01-15 08:45:00',
      description: 'Unauthorized access to financial documents',
      status: 'resolved'
    }
  ];

  const mockDLPPolicies: DLPPolicy[] = [
    {
      id: '1',
      name: 'Customer PII Protection',
      type: 'file',
      status: 'enabled',
      priority: 'critical',
      endpoints: 1247,
      violations: 23,
      lastModified: '2024-01-10'
    },
    {
      id: '2',
      name: 'Financial Data Control',
      type: 'email',
      status: 'enabled',
      priority: 'high',
      endpoints: 856,
      violations: 12,
      lastModified: '2024-01-08'
    },
    {
      id: '3',
      name: 'USB Device Control',
      type: 'device',
      status: 'enabled',
      priority: 'medium',
      endpoints: 2341,
      violations: 8,
      lastModified: '2024-01-05'
    }
  ];

  const summaryData = {
    protectedEndpoints: 967,
    policyViolations: 12,
    dataProtected: '2.3TB',
    blockedTransfers: 89
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

  const getPolicyTypeIcon = (type: string) => {
    switch (type) {
      case 'file': return Shield;
      case 'email': return Mail;
      case 'web': return Globe;
      case 'device': return Shield;
      case 'network': return Network;
      default: return Shield;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSyncPolicies = () => {
    alert('Syncing EDP policies...');
  };

  const handleAddEDP = () => {
    alert('Add EDP platform form will open...');
  };

  const handleEditPlatform = (platform: EDPPlatform) => {
    alert(`Edit platform: ${platform.name}`);
  };

  const handleDeletePlatform = (platform: EDPPlatform) => {
    if (window.confirm(`Are you sure you want to delete the EDP platform "${platform.name}"?`)) {
      alert(`Platform "${platform.name}" deleted`);
    }
  };

  const filteredPlatforms = mockEDPPlatforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedPlatform === 'all' || platform.status === selectedPlatform;
    return matchesSearch && matchesStatus;
  });

  const filteredViolations = mockViolations.filter(violation => {
    return selectedSeverity === 'all' || violation.severity === selectedSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Endpoint Data Protection</h1>
            <p className="text-gray-600">Manage data loss prevention and endpoint data security policies</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleSyncPolicies}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Policies</span>
            </button>
            <button 
              onClick={handleAddEDP}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add EDP</span>
            </button>
          </div>
        </div>
      </div>

      {/* EDP Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <ShieldCheck className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.protectedEndpoints}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Protected Endpoints</h3>
          <p className="text-sm text-gray-600">With DLP policies</p>
          <div className="mt-2 text-xs text-green-600">77.5% coverage</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{summaryData.policyViolations}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Policy Violations</h3>
          <p className="text-sm text-gray-600">Last 24 hours</p>
          <div className="mt-2 text-xs text-red-600">+3 from yesterday</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FileLock className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.dataProtected}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Data Protected</h3>
          <p className="text-sm text-gray-600">Under DLP policies</p>
          <div className="mt-2 text-xs text-green-600">+156GB this week</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <EyeOff className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.blockedTransfers}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Blocked Transfers</h3>
          <p className="text-sm text-gray-600">Prevented data loss</p>
          <div className="mt-2 text-xs text-green-600">Policy enforcement</div>
        </div>
      </div>

      {/* EDP Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Active EDP Solutions */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Data Protection Platforms</h2>
                                <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {mockEDPPlatforms.map((platform) => {
              const StatusIcon = getStatusIcon(platform.status);
              return (
                <div key={platform.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
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
                      <p className="text-xs text-gray-500">{platform.policies} policies</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Policy Violations */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Violations</h2>
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="space-y-3">
            {mockViolations.slice(0, 3).map((violation) => (
              <div key={violation.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{violation.asset}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                    {violation.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{violation.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{violation.policy}</span>
                  <span>{violation.timestamp}</span>
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
              placeholder="Search EDP platforms..."
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

      {/* EDP Platforms Grid */}
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
                      <span>Policies:</span>
                      <span className="font-medium">{platform.policies}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">{platform.violations}</div>
                      <div className="text-xs text-red-700">Violations</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{platform.dataProtected}</div>
                      <div className="text-xs text-blue-700">Protected</div>
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

      {/* DLP Policies */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">DLP Policies</h2>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Policy</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Policy Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Endpoints</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Violations</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockDLPPolicies.map((policy) => (
                <tr key={policy.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {React.createElement(getPolicyTypeIcon(policy.type), { className: "w-5 h-5 text-primary-600" })}
                      <span className="font-medium text-gray-900">{policy.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 capitalize">{policy.type}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      policy.status === 'enabled' ? 'bg-green-100 text-green-800' : 
                      policy.status === 'disabled' ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(policy.priority)}`}>
                      {policy.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{policy.endpoints.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{policy.violations}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Violations Detail */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Policy Violations</h2>
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
          {filteredViolations.map((violation) => (
            <div key={violation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  violation.severity === 'critical' ? 'bg-red-500' :
                  violation.severity === 'high' ? 'bg-orange-500' :
                  violation.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{violation.asset}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{violation.policy}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{violation.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">{violation.timestamp}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                    {violation.severity}
                  </span>
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

export default AssetsEDP;

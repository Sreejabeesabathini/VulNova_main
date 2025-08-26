import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Server,
  Monitor,
  Database,
  Globe,
  Activity,
  Shield,
  Zap,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Software {
  _id: string;
  name: string;
  version: string;
  vendor: string;
  type: 'Operating System' | 'Application' | 'Database' | 'Middleware' | 'Security Tool' | 'Development Tool';
  status: 'Active' | 'Deprecated' | 'End of Life' | 'Under Review';
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  installedAssets: number;
  lastUpdated: string;
  nextUpdate: string;
  description: string;
  vulnerabilities: number;
  compliance: 'Compliant' | 'Non-Compliant' | 'Under Review' | 'Unknown';
}

const SoftwareInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data for demonstration
  const mockSoftware: Software[] = [
    {
      _id: '1',
      name: 'Windows Server 2019',
      version: '10.0.17763',
      vendor: 'Microsoft',
      type: 'Operating System',
      status: 'Active',
      riskLevel: 'Medium',
      installedAssets: 45,
      lastUpdated: '2024-01-10T10:00:00Z',
      nextUpdate: '2024-02-10T10:00:00Z',
      description: 'Microsoft Windows Server operating system for enterprise environments',
      vulnerabilities: 12,
      compliance: 'Compliant'
    },
    {
      _id: '2',
      name: 'Adobe Acrobat Reader',
      version: '23.008.20470',
      vendor: 'Adobe',
      type: 'Application',
      status: 'Active',
      riskLevel: 'High',
      installedAssets: 234,
      lastUpdated: '2024-01-15T14:30:00Z',
      nextUpdate: '2024-02-15T14:30:00Z',
      description: 'PDF reader application with security features',
      vulnerabilities: 8,
      compliance: 'Compliant'
    },
    {
      _id: '3',
      name: 'Oracle Database',
      version: '19.3.0.0.0',
      vendor: 'Oracle',
      type: 'Database',
      status: 'Active',
      riskLevel: 'Critical',
      installedAssets: 12,
      lastUpdated: '2024-01-08T09:15:00Z',
      nextUpdate: '2024-02-08T09:15:00Z',
      description: 'Enterprise database management system',
      vulnerabilities: 25,
      compliance: 'Non-Compliant'
    },
    {
      _id: '4',
      name: 'Chrome Browser',
      version: '120.0.6099.109',
      vendor: 'Google',
      type: 'Application',
      status: 'Active',
      riskLevel: 'Low',
      installedAssets: 456,
      lastUpdated: '2024-01-15T16:45:00Z',
      nextUpdate: '2024-01-22T16:45:00Z',
      description: 'Web browser with security and performance features',
      vulnerabilities: 3,
      compliance: 'Compliant'
    },
    {
      _id: '5',
      name: 'CrowdStrike Falcon',
      version: '6.45.0',
      vendor: 'CrowdStrike',
      type: 'Security Tool',
      status: 'Active',
      riskLevel: 'Low',
      installedAssets: 789,
      lastUpdated: '2024-01-14T11:20:00Z',
      nextUpdate: '2024-01-21T11:20:00Z',
      description: 'Endpoint detection and response platform',
      vulnerabilities: 1,
      compliance: 'Compliant'
    },
    {
      _id: '6',
      name: 'Visual Studio Code',
      version: '1.85.1',
      vendor: 'Microsoft',
      type: 'Development Tool',
      status: 'Active',
      riskLevel: 'Low',
      installedAssets: 67,
      lastUpdated: '2024-01-12T13:10:00Z',
      nextUpdate: '2024-01-19T13:10:00Z',
      description: 'Code editor with extensions and debugging',
      vulnerabilities: 2,
      compliance: 'Compliant'
    }
  ];

  const filteredSoftware = mockSoftware.filter(software => {
    const matchesSearch = software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         software.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         software.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || software.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || software.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Operating System':
        return Server;
      case 'Application':
        return Package;
      case 'Database':
        return Database;
      case 'Middleware':
        return Activity;
      case 'Security Tool':
        return Shield;
      case 'Development Tool':
        return FileText;
      default:
        return Package;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Deprecated':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'End of Life':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'Compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Non-Compliant':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Unknown':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const softwareTypes = ['all', 'Operating System', 'Application', 'Database', 'Middleware', 'Security Tool', 'Development Tool'];
  const softwareStatuses = ['all', 'Active', 'Deprecated', 'End of Life', 'Under Review'];

  const summaryData = {
    total: mockSoftware.length,
    active: mockSoftware.filter(s => s.status === 'Active').length,
    critical: mockSoftware.filter(s => s.riskLevel === 'Critical').length,
    compliant: mockSoftware.filter(s => s.compliance === 'Compliant').length
  };

  const riskDistribution = {
    Critical: mockSoftware.filter(s => s.riskLevel === 'Critical').length,
    High: mockSoftware.filter(s => s.riskLevel === 'High').length,
    Medium: mockSoftware.filter(s => s.riskLevel === 'Medium').length,
    Low: mockSoftware.filter(s => s.riskLevel === 'Low').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Software Inventory</h1>
            <p className="text-gray-600">Track and manage software assets across your organization</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Scan Assets</span>
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Software</span>
            </button>
          </div>
        </div>
      </div>

      {/* Software Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{summaryData.total}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Software</h3>
          <p className="text-sm text-gray-600">All applications</p>
          <div className="mt-2 text-xs text-blue-600">Tracked</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{summaryData.active}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active</h3>
          <p className="text-sm text-gray-600">Currently in use</p>
          <div className="mt-2 text-xs text-green-600">Operational</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{summaryData.critical}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Critical Risk</h3>
          <p className="text-sm text-gray-600">High priority</p>
          <div className="mt-2 text-xs text-red-600">Action required</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{summaryData.compliant}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Compliant</h3>
          <p className="text-sm text-gray-600">Meet standards</p>
          <div className="mt-2 text-xs text-green-600">Standards met</div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-red-50">
            <div className="text-2xl font-bold text-red-600">{riskDistribution.Critical}</div>
            <div className="text-sm text-red-700">Critical</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-orange-50">
            <div className="text-2xl font-bold text-orange-600">{riskDistribution.High}</div>
            <div className="text-sm text-orange-700">High</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-yellow-50">
            <div className="text-2xl font-bold text-yellow-600">{riskDistribution.Medium}</div>
            <div className="text-sm text-yellow-700">Medium</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-50">
            <div className="text-2xl font-bold text-green-600">{riskDistribution.Low}</div>
            <div className="text-sm text-green-700">Low</div>
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
              placeholder="Search software by name, vendor, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              {softwareTypes.map(type => (
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
              {softwareStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Software Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSoftware.map((software) => {
          const TypeIcon = getTypeIcon(software.type);
          
          return (
            <div key={software._id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Software Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(software.riskLevel)}`}>
                      {software.riskLevel}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(software.status)}`}>
                      {software.status}
                    </span>
                  </div>
                </div>

                {/* Software Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{software.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{software.description}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Vendor:</span>
                      <span className="font-medium">{software.vendor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Version:</span>
                      <span className="font-medium">{software.version}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{software.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Installed Assets:</span>
                      <span className="font-medium">{software.installedAssets}</span>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">{software.vulnerabilities}</div>
                      <div className="text-xs text-red-700">Vulnerabilities</div>
                    </div>
                    <div className="text-center p-3 rounded-lg" style={{
                      backgroundColor: software.compliance === 'Compliant' ? '#f0fdf4' : 
                                    software.compliance === 'Non-Compliant' ? '#fef2f2' : '#fefce8'
                    }}>
                      <div className={`text-lg font-bold ${
                        software.compliance === 'Compliant' ? 'text-green-600' : 
                        software.compliance === 'Non-Compliant' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {software.compliance}
                      </div>
                      <div className="text-xs text-gray-700">Compliance</div>
                    </div>
                  </div>
                </div>

                {/* Update Info */}
                <div className="mb-4">
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Last Updated:</span>
                      <span>{new Date(software.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Next Update:</span>
                      <span>{new Date(software.nextUpdate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Eye className="w-4 h-4 inline mr-1" />
                    View Details
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSoftware.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No software found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Add First Software
          </button>
        </div>
      )}
    </div>
  );
};

export default SoftwareInventory;

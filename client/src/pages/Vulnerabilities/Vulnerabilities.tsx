import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  RefreshCw,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Vulnerability {
  _id: string;
  title: string;
  cve: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'False Positive';
  affectedAssets: number;
  cvssScore: number;
  publishedDate: string;
  lastSeen: string;
  description: string;
  remediation: string;
}

const Vulnerabilities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data for demonstration
  const mockVulnerabilities: Vulnerability[] = [
    {
      _id: '1',
      title: 'Apache Log4j Remote Code Execution',
      cve: 'CVE-2021-44228',
      severity: 'Critical',
      status: 'Open',
      affectedAssets: 15,
      cvssScore: 10.0,
      publishedDate: '2021-12-09',
      lastSeen: '2024-01-15T10:30:00Z',
      description: 'Apache Log4j2 versions 2.0-beta9 through 2.14.1 are vulnerable to remote code execution.',
      remediation: 'Upgrade to Log4j2 version 2.15.0 or later.'
    },
    {
      _id: '2',
      title: 'Microsoft Exchange Server SSRF',
      cve: 'CVE-2021-26855',
      severity: 'High',
      status: 'In Progress',
      affectedAssets: 8,
      cvssScore: 8.8,
      publishedDate: '2021-03-02',
      lastSeen: '2024-01-14T15:45:00Z',
      description: 'Microsoft Exchange Server contains a server-side request forgery vulnerability.',
      remediation: 'Apply the latest security updates from Microsoft.'
    },
    {
      _id: '3',
      title: 'OpenSSL Heartbleed',
      cve: 'CVE-2014-0160',
      severity: 'High',
      status: 'Resolved',
      affectedAssets: 0,
      cvssScore: 7.5,
      publishedDate: '2014-04-07',
      lastSeen: '2024-01-10T09:15:00Z',
      description: 'OpenSSL contains a vulnerability in the TLS/DTLS heartbeat extension.',
      remediation: 'Upgrade to OpenSSL 1.0.1g or later.'
    },
    {
      _id: '4',
      title: 'WordPress Plugin SQL Injection',
      cve: 'CVE-2023-1234',
      severity: 'Medium',
      status: 'Open',
      affectedAssets: 3,
      cvssScore: 6.5,
      publishedDate: '2023-06-15',
      lastSeen: '2024-01-15T08:20:00Z',
      description: 'WordPress plugin contains a SQL injection vulnerability.',
      remediation: 'Update the plugin to the latest version.'
    }
  ];

  const filteredVulnerabilities = mockVulnerabilities.filter(vuln => {
    const matchesSearch = vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.cve.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || vuln.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || vuln.status === selectedStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
      case 'Open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'False Positive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return AlertTriangle;
      case 'In Progress':
        return Clock;
      case 'Resolved':
        return CheckCircle;
      case 'False Positive':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getCVSSColor = (score: number) => {
    if (score >= 9.0) return 'text-red-600';
    if (score >= 7.0) return 'text-orange-600';
    if (score >= 4.0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const severityCounts = {
    Critical: mockVulnerabilities.filter(v => v.severity === 'Critical').length,
    High: mockVulnerabilities.filter(v => v.severity === 'High').length,
    Medium: mockVulnerabilities.filter(v => v.severity === 'Medium').length,
    Low: mockVulnerabilities.filter(v => v.severity === 'Low').length
  };

  const statusCounts = {
    Open: mockVulnerabilities.filter(v => v.status === 'Open').length,
    'In Progress': mockVulnerabilities.filter(v => v.status === 'In Progress').length,
    Resolved: mockVulnerabilities.filter(v => v.status === 'Resolved').length,
    'False Positive': mockVulnerabilities.filter(v => v.status === 'False Positive').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vulnerability Management</h1>
            <p className="text-gray-600">Identify, assess, and remediate security vulnerabilities across your infrastructure</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Scan Now</span>
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Vulnerability</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vulnerability Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{severityCounts.Critical}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Critical</h3>
          <p className="text-sm text-gray-600">Immediate action required</p>
          <div className="mt-2 text-xs text-red-600">High priority</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-600">{severityCounts.High}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">High</h3>
          <p className="text-sm text-gray-600">Address within 24 hours</p>
          <div className="mt-2 text-xs text-orange-600">Priority</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">{severityCounts.Medium}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Medium</h3>
          <p className="text-sm text-gray-600">Address within 7 days</p>
          <div className="mt-2 text-xs text-yellow-600">Moderate</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{severityCounts.Low}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Low</h3>
          <p className="text-sm text-gray-600">Address within 30 days</p>
          <div className="mt-2 text-xs text-green-600">Low priority</div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-red-50">
            <div className="text-2xl font-bold text-red-600">{statusCounts.Open}</div>
            <div className="text-sm text-red-700">Open</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-yellow-50">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts['In Progress']}</div>
            <div className="text-sm text-yellow-700">In Progress</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-50">
            <div className="text-2xl font-bold text-green-600">{statusCounts.Resolved}</div>
            <div className="text-sm text-green-700">Resolved</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold text-gray-600">{statusCounts['False Positive']}</div>
            <div className="text-sm text-gray-700">False Positive</div>
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
              placeholder="Search vulnerabilities by title, CVE, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="False Positive">False Positive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vulnerabilities Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Vulnerabilities</h3>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vulnerability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CVSS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVulnerabilities.map((vuln) => {
                const StatusIcon = getStatusIcon(vuln.status);
                return (
                  <tr key={vuln._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vuln.title}</div>
                        <div className="text-sm text-gray-500 font-mono">{vuln.cve}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vuln.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {vuln.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${getCVSSColor(vuln.cvssScore)}`}>
                        {vuln.cvssScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {vuln.affectedAssets} asset{vuln.affectedAssets !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(vuln.lastSeen).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/vulnerabilities/${vuln._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredVulnerabilities.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vulnerabilities found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Add First Vulnerability
          </button>
        </div>
      )}
    </div>
  );
};

export default Vulnerabilities;

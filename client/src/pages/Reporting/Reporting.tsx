import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter,
  Eye,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Server,
  Network,
  Globe,
  Database,
  Activity,
  Zap,
  Target,
  BarChart,
  Plus
} from 'lucide-react';

interface Report {
  _id: string;
  name: string;
  type: 'Security' | 'Compliance' | 'Risk' | 'Asset' | 'Vulnerability' | 'Threat';
  status: 'Generated' | 'In Progress' | 'Failed' | 'Scheduled';
  lastGenerated: string;
  nextScheduled: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'HTML';
  size: string;
  description: string;
  tags: string[];
}

const Reporting: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');

  // Mock data for demonstration
  const mockReports: Report[] = [
    {
      _id: '1',
      name: 'Monthly Security Posture Report',
      type: 'Security',
      status: 'Generated',
      lastGenerated: '2024-01-15T10:30:00Z',
      nextScheduled: '2024-02-15T10:30:00Z',
      format: 'PDF',
      size: '2.4 MB',
      description: 'Comprehensive monthly security assessment and risk analysis',
      tags: ['Monthly', 'Security', 'Executive']
    },
    {
      _id: '2',
      name: 'Vulnerability Assessment Summary',
      type: 'Vulnerability',
      status: 'Generated',
      lastGenerated: '2024-01-14T15:45:00Z',
      nextScheduled: '2024-01-21T15:45:00Z',
      format: 'Excel',
      size: '1.8 MB',
      description: 'Weekly vulnerability scan results and remediation progress',
      tags: ['Weekly', 'Vulnerability', 'Technical']
    },
    {
      _id: '3',
      name: 'Asset Inventory Report',
      type: 'Asset',
      status: 'Generated',
      lastGenerated: '2024-01-13T09:15:00Z',
      nextScheduled: '2024-01-20T09:15:00Z',
      format: 'CSV',
      size: '856 KB',
      description: 'Complete asset inventory with risk scores and compliance status',
      tags: ['Weekly', 'Asset', 'Inventory']
    },
    {
      _id: '4',
      name: 'Threat Intelligence Summary',
      type: 'Threat',
      status: 'In Progress',
      lastGenerated: '2024-01-12T14:20:00Z',
      nextScheduled: '2024-01-19T14:20:00Z',
      format: 'PDF',
      size: 'N/A',
      description: 'Current threat landscape and emerging risks analysis',
      tags: ['Weekly', 'Threat', 'Intelligence']
    },
    {
      _id: '5',
      name: 'Compliance Audit Report',
      type: 'Compliance',
      status: 'Scheduled',
      lastGenerated: '2024-01-10T11:00:00Z',
      nextScheduled: '2024-01-17T11:00:00Z',
      format: 'PDF',
      size: 'N/A',
      description: 'Regulatory compliance status and audit findings',
      tags: ['Weekly', 'Compliance', 'Audit']
    },
    {
      _id: '6',
      name: 'Risk Assessment Dashboard',
      type: 'Risk',
      status: 'Generated',
      lastGenerated: '2024-01-15T08:00:00Z',
      nextScheduled: '2024-01-22T08:00:00Z',
      format: 'HTML',
      size: '3.2 MB',
      description: 'Interactive risk assessment dashboard with metrics',
      tags: ['Weekly', 'Risk', 'Dashboard']
    }
  ];

  const filteredReports = mockReports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Security':
        return Shield;
      case 'Compliance':
        return CheckCircle;
      case 'Risk':
        return AlertTriangle;
      case 'Asset':
        return Server;
      case 'Vulnerability':
        return AlertTriangle;
      case 'Threat':
        return Target;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return FileText;
      case 'Excel':
        return BarChart;
      case 'CSV':
        return BarChart3;
      case 'HTML':
        return Globe;
      default:
        return FileText;
    }
  };

  const reportTypes = ['all', 'Security', 'Compliance', 'Risk', 'Asset', 'Vulnerability', 'Threat'];
  const reportStatuses = ['all', 'Generated', 'In Progress', 'Failed', 'Scheduled'];

  const summaryData = {
    total: mockReports.length,
    generated: mockReports.filter(r => r.status === 'Generated').length,
    inProgress: mockReports.filter(r => r.status === 'In Progress').length,
    scheduled: mockReports.filter(r => r.status === 'Scheduled').length
  };

  const chartData = {
    security: 25,
    compliance: 20,
    risk: 18,
    asset: 15,
    vulnerability: 12,
    threat: 10
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reporting & Analytics</h1>
            <p className="text-gray-600">Generate comprehensive security reports and analyze trends</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule Report</span>
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{summaryData.total}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Reports</h3>
          <p className="text-sm text-gray-600">All report types</p>
          <div className="mt-2 text-xs text-blue-600">Available</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{summaryData.generated}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Generated</h3>
          <p className="text-sm text-gray-600">Ready for download</p>
          <div className="mt-2 text-xs text-green-600">Available</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">{summaryData.inProgress}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">In Progress</h3>
          <p className="text-sm text-gray-600">Currently generating</p>
          <div className="mt-2 text-xs text-yellow-600">Processing</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{summaryData.scheduled}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Scheduled</h3>
          <p className="text-sm text-gray-600">Auto-generation</p>
          <div className="mt-2 text-xs text-blue-600">Automated</div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Report Type Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Type Distribution</h3>
          <div className="space-y-4">
            {Object.entries(chartData).map(([type, percentage]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Report Activity</h3>
          <div className="space-y-4">
            {mockReports.slice(0, 5).map((report) => (
              <div key={report._id} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{report.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.lastGenerated).toLocaleDateString()} • {report.format}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              {reportTypes.map(type => (
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
              {reportStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Available Reports</h3>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export List</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Generated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Scheduled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => {
                const TypeIcon = getTypeIcon(report.type);
                const FormatIcon = getFormatIcon(report.format);
                
                return (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-sm text-gray-500">{report.description}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {report.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="w-4 h-4 text-primary-600" />
                        <span className="text-sm text-gray-900">{report.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(report.lastGenerated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(report.nextScheduled).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <FormatIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{report.format}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {report.status === 'Generated' && (
                          <button className="text-primary-600 hover:text-primary-900">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Calendar className="w-4 h-4" />
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
      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filter criteria.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Create First Report
          </button>
        </div>
      )}
    </div>
  );
};

export default Reporting;

import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Shield, 
  Server, 
  Monitor, 
  Database, 
  Network,
  Globe,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Settings,
  Filter,
  Search,
  Calendar,
  MapPin,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Lock,
  Unlock,
  Info,
  ExternalLink,
  GitBranch,
  Layers,
  Link,
  AlertCircle
} from 'lucide-react';

interface DashboardMetric {
  id: string;
  name: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  color: string;
}

interface AssetType {
  name: string;
  count: number;
  percentage: number;
  icon: any;
  color: string;
}

interface RiskDistribution {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

interface RecentActivity {
  id: string;
  asset: string;
  action: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  user: string;
}

const AssetsDashboards: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedView, setSelectedView] = useState('overview');

  // Mock data for demonstration
  const mockMetrics: DashboardMetric[] = [
    {
      id: '1',
      name: 'Total Assets',
      value: '6,133',
      change: '+23',
      changeType: 'positive',
      icon: Server,
      color: 'text-blue-600'
    },
    {
      id: '2',
      name: 'Active Assets',
      value: '5,847',
      change: '+15',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '3',
      name: 'High Risk',
      value: '156',
      change: '-8',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      id: '4',
      name: 'Protected',
      value: '5,234',
      change: '+45',
      changeType: 'positive',
      icon: Shield,
      color: 'text-purple-600'
    }
  ];

  const mockAssetTypes: AssetType[] = [
    { name: 'Servers', count: 1247, percentage: 20.3, icon: Server, color: 'text-blue-600' },
    { name: 'Workstations', count: 3456, percentage: 56.3, icon: Monitor, color: 'text-green-600' },
    { name: 'Network Devices', count: 234, percentage: 3.8, icon: Network, color: 'text-purple-600' },
    { name: 'Databases', count: 89, percentage: 1.5, icon: Database, color: 'text-orange-600' },
    { name: 'Web Apps', count: 67, percentage: 1.1, icon: Globe, color: 'text-red-600' },
    { name: 'Other', count: 1040, percentage: 17.0, icon: HardDrive, color: 'text-gray-600' }
  ];

  const mockRiskDistribution: RiskDistribution[] = [
    { level: 'Critical', count: 23, percentage: 0.4, color: 'bg-red-500' },
    { level: 'High', count: 156, percentage: 2.5, color: 'bg-orange-500' },
    { level: 'Medium', count: 456, percentage: 7.4, color: 'bg-yellow-500' },
    { level: 'Low', count: 2345, percentage: 38.2, color: 'bg-green-500' },
    { level: 'None', count: 3153, percentage: 51.5, color: 'bg-gray-500' }
  ];

  const mockRecentActivity: RecentActivity[] = [
    {
      id: '1',
      asset: 'Web-Server-01',
      action: 'Vulnerability scan completed',
      timestamp: '2 minutes ago',
      status: 'success',
      user: 'john.doe'
    },
    {
      id: '2',
      asset: 'DB-Server-01',
      action: 'Security patch applied',
      timestamp: '15 minutes ago',
      status: 'success',
      user: 'jane.smith'
    },
    {
      id: '3',
      asset: 'Workstation-45',
      action: 'EDR agent updated',
      timestamp: '1 hour ago',
      status: 'warning',
      user: 'system'
    },
    {
      id: '4',
      asset: 'Router-01',
      action: 'Configuration change detected',
      timestamp: '2 hours ago',
      status: 'info',
      user: 'bob.johnson'
    }
  ];

  const mockCloudStatus = {
    total: 6133,
    unsupported: 15,
    reporting: 4675,
    pending: 312,
    notReporting: 2
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const handleExport = () => {
    alert('Exporting dashboard data...');
  };

  const handleRefresh = () => {
    alert('Refreshing dashboard data...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Dashboards</h1>
            <p className="text-gray-600">Comprehensive overview and analytics of your asset infrastructure</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={handleRefresh}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeframe and View Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Timeframe:</label>
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">View:</label>
            <select 
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed</option>
              <option value="comparison">Comparison</option>
              <option value="trends">Trends</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mockMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{metric.name}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Asset Distribution and Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Asset Types Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Asset Types Distribution</h2>
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {mockAssetTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${type.color}`} />
                    <span className="text-sm font-medium text-gray-900">{type.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${type.color.replace('text-', 'bg-')}`}
                        style={{ width: `${type.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {type.count.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {type.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Risk Distribution</h2>
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="space-y-4">
            {mockRiskDistribution.map((risk) => (
              <div key={risk.level} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${risk.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{risk.level}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${risk.color}`}
                      style={{ width: `${risk.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {risk.count.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {risk.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud Status Table */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Public Cloud Status</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">CrowdStrike Status</span>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Oracle</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Nutanix</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">GCP</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Azure</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Total</td>
                <td className="py-3 px-4 text-gray-600">{mockCloudStatus.total.toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-600">48</td>
                <td className="py-3 px-4 text-gray-600">1</td>
                <td className="py-3 px-4 text-gray-600">5,474</td>
                <td className="py-3 px-4 text-gray-600">-</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Unsupported</td>
                <td className="py-3 px-4 text-gray-600">{mockCloudStatus.unsupported}</td>
                <td className="py-3 px-4 text-gray-600">1</td>
                <td className="py-3 px-4 text-gray-600">0</td>
                <td className="py-3 px-4 text-gray-600">2</td>
                <td className="py-3 px-4 text-gray-600">-</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Reporting</td>
                <td className="py-3 px-4 text-gray-600">{mockCloudStatus.reporting.toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-600">16</td>
                <td className="py-3 px-4 text-gray-600">1</td>
                <td className="py-3 px-4 text-gray-600">4,201</td>
                <td className="py-3 px-4 text-gray-600">-</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Pending</td>
                <td className="py-3 px-4 text-gray-600">{mockCloudStatus.pending}</td>
                <td className="py-3 px-4 text-gray-600">0</td>
                <td className="py-3 px-4 text-gray-600">0</td>
                <td className="py-3 px-4 text-gray-600">312</td>
                <td className="py-3 px-4 text-gray-600">-</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Not Reporting - Installed</td>
                <td className="py-3 px-4 text-gray-600">{mockCloudStatus.notReporting}</td>
                <td className="py-3 px-4 text-gray-600">0</td>
                <td className="py-3 px-4 text-gray-600">0</td>
                <td className="py-3 px-4 text-gray-600">2</td>
                <td className="py-3 px-4 text-gray-600">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {mockRecentActivity.map((activity) => {
              const StatusIcon = getStatusIcon(activity.status);
              return (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <StatusIcon className={`w-5 h-5 ${activity.status === 'success' ? 'text-green-600' : 
                                                      activity.status === 'warning' ? 'text-yellow-600' : 
                                                      activity.status === 'error' ? 'text-red-600' : 'text-blue-600'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{activity.asset}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>by {activity.user}</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Statistics */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Statistics</h2>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">98.5%</div>
                <div className="text-sm text-blue-700">Uptime</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">87.3%</div>
                <div className="text-sm text-green-700">Coverage</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">2.3s</div>
                <div className="text-sm text-purple-700">Avg Response</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">156</div>
                <div className="text-sm text-orange-700">Alerts</div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">System Health</span>
                <span className="text-sm text-green-600">Good</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Overview */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Infrastructure Overview</h2>
          <div className="flex items-center space-x-2">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              <Eye className="w-4 h-4 inline mr-1" />
              View Details
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Server className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-sm text-gray-600">Servers</div>
            <div className="text-xs text-green-600 mt-1">+12 this week</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Monitor className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">3,456</div>
            <div className="text-sm text-gray-600">Workstations</div>
            <div className="text-xs text-green-600 mt-1">+23 this week</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Network className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">234</div>
            <div className="text-sm text-gray-600">Network Devices</div>
            <div className="text-xs text-blue-600 mt-1">+3 this week</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Database className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">89</div>
            <div className="text-sm text-gray-600">Databases</div>
            <div className="text-xs text-green-600 mt-1">+1 this week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsDashboards;

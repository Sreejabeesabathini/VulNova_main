import React from 'react';
import { useDashboardData, useRiskiestAssets, useRecentVulnerabilities } from '../../hooks/useApiCache';
import DashboardCard from '../../components/Dashboard/DashboardCard';
import RiskGauge from '../../components/Dashboard/RiskGauge';
import RiskyAssetsTable from '../../components/Dashboard/RiskyAssetsTable';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Zap,
  RefreshCw,
  Download,
  TrendingUp,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardData();
  const { data: riskiestAssetsData, isLoading: assetsLoading } = useRiskiestAssets();
  const { data: recentVulnsData, isLoading: vulnsLoading } = useRecentVulnerabilities();

  const dashboard = dashboardData?.data;
  const riskiestAssets = riskiestAssetsData?.data || [];
  const recentVulnerabilities = recentVulnsData?.data || [];

  // Mock data for demonstration (replace with real data when available)
  const mockData = {
    totalAssets: dashboard?.totalAssets || 1247,
    totalVulnerabilities: (dashboard?.vulnerabilities?.critical || 0) + (dashboard?.vulnerabilities?.high || 0) + (dashboard?.vulnerabilities?.medium || 0) + (dashboard?.vulnerabilities?.low || 0) || 89,
    activeThreats: dashboard?.totalThreats || 23,
    riskScore: dashboard?.riskScore || 650
  };

  const getRiskStatus = (score: number) => {
    if (score >= 800) return 'Critical';
    if (score >= 600) return 'High';
    if (score >= 400) return 'Medium';
    if (score >= 200) return 'Low';
    return 'Very Low';
  };

  const vulnerabilitySummary = dashboard?.vulnerabilities || {
    critical: 12,
    high: 28,
    medium: 35,
    low: 14
  };

  const recentActivities = [
    { id: 1, type: 'scan', message: 'Asset scan completed for Server-001', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'vulnerability', message: 'New critical vulnerability detected', time: '15 minutes ago', status: 'warning' },
    { id: 3, type: 'threat', message: 'Threat intelligence updated', time: '1 hour ago', status: 'info' },
    { id: 4, type: 'asset', message: 'New asset discovered', time: '2 hours ago', status: 'success' },
    { id: 5, type: 'scan', message: 'Scheduled vulnerability scan started', time: '3 hours ago', status: 'info' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan':
        return <Activity className="w-4 h-4" />;
      case 'vulnerability':
        return <AlertTriangle className="w-4 h-4" />;
      case 'threat':
        return <Shield className="w-4 h-4" />;
      case 'asset':
        return <Users className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (dashboardLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
        <p className="text-xl text-gray-600">Monitor your organization's security posture in real-time</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>View Trends</span>
        </button>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Assets"
          value={mockData.totalAssets}
          icon={Users}
          trend="up"
          description="Monitored assets"
          className="hover:shadow-lg transition-shadow duration-200"
        />
        <DashboardCard
          title="Vulnerabilities"
          value={mockData.totalVulnerabilities}
          icon={AlertTriangle}
          trend="down"
          description="Active threats"
          className="hover:shadow-lg transition-shadow duration-200"
        />
        <DashboardCard
          title="Active Threats"
          value={mockData.activeThreats}
          icon={Shield}
          trend="stable"
          description="Current threats"
          className="hover:shadow-lg transition-shadow duration-200"
        />
        <DashboardCard
          title="Risk Score"
          value={mockData.riskScore}
          icon={Zap}
          trend="down"
          description="Overall risk level"
          className="hover:shadow-lg transition-shadow duration-200"
        />
      </div>

      {/* Risk Assessment and Asset Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Gauge */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Risk Assessment</h3>
            <RiskGauge riskScore={mockData.riskScore} riskStatus={getRiskStatus(mockData.riskScore)} size="lg" />
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {mockData.riskScore > 700 ? 'High Risk' : mockData.riskScore > 400 ? 'Medium Risk' : 'Low Risk'}
              </p>
            </div>
          </div>
        </div>

        {/* Asset Categories Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Servers</p>
                <p className="text-2xl font-bold text-blue-600">456</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Workstations</p>
                <p className="text-2xl font-bold text-green-600">623</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Network</p>
                <p className="text-2xl font-bold text-purple-600">89</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Databases</p>
                <p className="text-2xl font-bold text-orange-600">45</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
                <Users className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Applications</p>
                <p className="text-2xl font-bold text-red-600">34</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer">
                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Cloud</p>
                <p className="text-2xl font-bold text-indigo-600">28</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risky Assets Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Risky Assets</h3>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
            View All Assets
          </button>
        </div>
        <RiskyAssetsTable assets={riskiestAssets} isLoading={assetsLoading} />
      </div>

      {/* Recent Activities and Vulnerability Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerability Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vulnerability Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">Critical</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{vulnerabilitySummary.critical}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">High</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">{vulnerabilitySummary.high}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Medium</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{vulnerabilitySummary.medium}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Low</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{vulnerabilitySummary.low}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

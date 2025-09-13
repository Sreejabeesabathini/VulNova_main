import React from "react";
import { useDashboardData } from "../../hooks/useApiCache";
import DashboardCard from "../../components/Dashboard/DashboardCard";
import RiskGauge from "../../components/Dashboard/RiskGauge";
import RiskyAssetsTable from "../../components/Dashboard/RiskyAssetsTable";
import AssetsNotScannedCard from "../../components/Dashboard/AssetsNotScannedCard";
import AssetsMissingEDRCard from "../../components/Dashboard/AssetsMissingEDRCard";
import RiskScoreTrendChart from "../../components/Dashboard/RiskScoreTrendChart";
import {
  Users,
  AlertTriangle,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { DashboardSummary } from "../../types";

const Dashboard: React.FC = () => {
  const { data: dashboardResponse, isLoading, error } = useDashboardData();
  const dashboard: DashboardSummary | undefined = dashboardResponse;

  const getRiskStatus = (score: number) => {
    if (score >= 800) return "Critical";
    if (score >= 600) return "High";
    if (score >= 400) return "Medium";
    if (score >= 200) return "Low";
    return "Very Low";
  };

  const vulnerabilitySummary = dashboard?.vulnerabilities || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-red-600">
            Failed to load dashboard data. Please check the console for details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Security Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Monitor your organization's security posture in real-time
        </p>
      </header>

      {/* Top Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Assets"
          value={dashboard?.totalAssets || 0}
          icon={Users}
          trend="up"
          trendValue="+12%"
          description="Monitored assets"
        />
        <DashboardCard
          title="Vulnerabilities"
          value={
            vulnerabilitySummary.critical +
            vulnerabilitySummary.high +
            vulnerabilitySummary.medium +
            vulnerabilitySummary.low
          }
          icon={AlertTriangle}
          trend="down"
          trendValue="-8%"
          description="Active vulnerabilities"
        />
        <DashboardCard
          title="Active Threats"
          value={dashboard?.totalThreats || 0}
          icon={Shield}
          trend="stable"
          trendValue="0%"
          description="Current threats"
        />
        {/* Risk Score Trend (same height as others) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-56 flex flex-col">
          <RiskScoreTrendChart />
        </div>
      </section>

      {/* Risk Assessment + Vulnerability Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Gauge */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200 h-full flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Overall Risk Assessment
            </h3>
            <RiskGauge
              riskScore={dashboard?.riskScore || 0}
              riskStatus={getRiskStatus(dashboard?.riskScore || 0)}
              size="lg"
            />
          </div>
        </div>

        {/* Vulnerability Breakdown */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Vulnerability Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
              {/* Critical */}
              <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200 flex flex-col justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {vulnerabilitySummary.critical}
                </div>
                <div className="text-sm font-medium text-red-700">Critical</div>
              </div>
              {/* High */}
              <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200 flex flex-col justify-center">
                <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {vulnerabilitySummary.high}
                </div>
                <div className="text-sm font-medium text-orange-700">High</div>
              </div>
              {/* Medium */}
              <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex flex-col justify-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {vulnerabilitySummary.medium}
                </div>
                <div className="text-sm font-medium text-yellow-700">Medium</div>
              </div>
              {/* Low */}
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200 flex flex-col justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {vulnerabilitySummary.low}
                </div>
                <div className="text-sm font-medium text-green-700">Low</div>
              </div>
            </div>
            <div className="text-center mt-4 text-sm text-gray-600">
              Total vulnerabilities across all assets
            </div>
          </div>
        </div>
      </section>

      {/* Riskiest Assets + Side Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Table */}
        <div className="lg:col-span-4">
          <RiskyAssetsTable />
        </div>
        {/* Side cards */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <AssetsNotScannedCard />
          <AssetsMissingEDRCard />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

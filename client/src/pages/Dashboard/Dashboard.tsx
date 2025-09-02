// src/pages/Dashboard/Dashboard.tsx

import React from "react";
import { useDashboardData } from "../../hooks/useApiCache";
import DashboardCard from "../../components/Dashboard/DashboardCard";
import RiskGauge from "../../components/Dashboard/RiskGauge";
import RiskyAssetsTable from "../../components/Dashboard/RiskyAssetsTable";
import { Users, AlertTriangle, Shield, Zap } from "lucide-react";
import { DashboardSummary } from "../../types";

const Dashboard: React.FC = () => {
  const { data: dashboardResponse, isLoading: dashboardLoading } = useDashboardData();

  // ✅ unwrap safely
  const dashboard: DashboardSummary | undefined = dashboardResponse;

  const getRiskStatus = (score: number) => {
    if (score >= 800) return "Critical";
    if (score >= 600) return "High";
    if (score >= 400) return "Medium";
    if (score >= 200) return "Low";
    return "Very Low";
  };

  // ✅ vulnerabilities fallback (snake_case)
  const vulnerabilitySummary = dashboard?.vulnerabilities || {
    critical_vulns: 0,
    high_vulns: 0,
    medium_vulns: 0,
    low_vulns: 0,
  };

  if (dashboardLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
        <p className="text-xl text-gray-600">
          Monitor your organization's security posture in real-time
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Assets"
          value={dashboard?.totalAssets || 0}
          icon={Users}
          trend="up"
          description="Monitored assets"
        />
        <DashboardCard
          title="Vulnerabilities"
          value={
            vulnerabilitySummary.critical_vulns +
            vulnerabilitySummary.high_vulns +
            vulnerabilitySummary.medium_vulns +
            vulnerabilitySummary.low_vulns
          }
          icon={AlertTriangle}
          trend="down"
          description="Active vulnerabilities"
        />
        <DashboardCard
          title="Active Threats"
          value={dashboard?.total_threats || 0} // ✅ backend snake_case
          icon={Shield}
          trend="stable"
          description="Current threats"
        />
        <DashboardCard
          title="Risk Score"
          value={dashboard?.risk_score || 0} // ✅ backend snake_case
          icon={Zap}
          trend="down"
          description="Overall risk level"
        />
      </div>

      {/* Risk Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Overall Risk Assessment
            </h3>
            <RiskGauge
              riskScore={dashboard?.risk_score || 0} // ✅ backend snake_case
              riskStatus={getRiskStatus(dashboard?.risk_score || 0)}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Vulnerability Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Vulnerability Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between p-3 rounded-lg bg-red-50 border border-red-200">
            <span>Critical</span>
            <span className="text-2xl font-bold text-red-600">
              {vulnerabilitySummary.critical_vulns}
            </span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-orange-50 border border-orange-200">
            <span>High</span>
            <span className="text-2xl font-bold text-orange-600">
              {vulnerabilitySummary.high_vulns}
            </span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <span>Medium</span>
            <span className="text-2xl font-bold text-yellow-600">
              {vulnerabilitySummary.medium_vulns}
            </span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-green-50 border border-green-200">
            <span>Low</span>
            <span className="text-2xl font-bold text-green-600">
              {vulnerabilitySummary.low_vulns}
            </span>
          </div>
        </div>
      </div>

      {/* Riskiest Assets Table */}
      <RiskyAssetsTable />
    </div>
  );
};

export default Dashboard;

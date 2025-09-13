// src/components/Dashboard/RiskyAssetsTable.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../services/api";
import { Asset } from "../../types";

const RiskyAssetsTable: React.FC = () => {
  const { data, isLoading, isError } = useQuery<Asset[]>({
    queryKey: ["riskiest-assets"],
    queryFn: () => dashboardApi.getRiskiestAssets(),
    staleTime: 2 * 60 * 1000,
  });

  // ✅ fallback ensures assets is always an array
  const assets: Asset[] = data ?? [];

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-white rounded-xl border border-red-200 text-red-600">
        Failed to load riskiest assets.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Top Riskiest Assets</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Risk Score
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Critical Vulns
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Last Seen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="px-6 py-4 whitespace-nowrap">{asset.asset_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{asset.ip_address}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-red-600">
                  {asset.risk_score || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{asset.critical_vulns || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {asset.last_seen
                    ? new Date(asset.last_seen).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No risky assets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskyAssetsTable;

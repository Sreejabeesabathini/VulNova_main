import React, { useState } from 'react';
import { Asset } from '../../types';
import { 
  AlertTriangle, 
  Server, 
  Monitor, 
  Globe, 
  Database, 
  HardDrive,
  Eye,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';

interface RiskyAssetsTableProps {
  assets: Asset[];
  isLoading?: boolean;
  maxRows?: number;
}

const RiskyAssetsTable: React.FC<RiskyAssetsTableProps> = ({ 
  assets, 
  isLoading = false, 
  maxRows = 5 
}) => {
  const [sortBy, setSortBy] = useState<'riskScore' | 'criticalVulns' | 'lastSeen'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getAssetTypeIcon = (assetType: string) => {
    switch (assetType.toLowerCase()) {
      case 'server':
        return Server;
      case 'workstation':
        return Monitor;
      case 'network':
        return Globe;
      case 'database':
        return Database;
      case 'application':
        return HardDrive;
      default:
        return Server;
    }
  };

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 800) return { level: 'Critical', color: 'status-critical' };
    if (riskScore >= 600) return { level: 'High', color: 'status-high' };
    if (riskScore >= 400) return { level: 'Medium', color: 'status-medium' };
    if (riskScore >= 200) return { level: 'Low', color: 'status-low' };
    return { level: 'Minimal', color: 'status-low' };
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSort = (field: 'riskScore' | 'criticalVulns' | 'lastSeen') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortBy) {
      case 'riskScore':
        aValue = a.riskScore;
        bValue = b.riskScore;
        break;
      case 'criticalVulns':
        aValue = a.criticalVulns;
        bValue = b.criticalVulns;
        break;
      case 'lastSeen':
        aValue = new Date(a.lastSeen).getTime();
        bValue = new Date(b.lastSeen).getTime();
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  }).slice(0, maxRows);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <div className="w-4 h-4" />;
    return sortOrder === 'asc' ? 
      <TrendingUp className="w-4 h-4 text-blue-600" /> : 
      <TrendingUp className="w-4 h-4 text-blue-600 transform rotate-180" />;
  };

  if (isLoading) {
    return (
      <div className="card-modern p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Risky Assets</h3>
              <p className="text-sm text-gray-500">Assets requiring immediate attention</p>
            </div>
          </div>
          <button className="btn-secondary text-sm py-2 px-4">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead>
            <tr>
              <th className="table-header">
                <button 
                  onClick={() => handleSort('riskScore')}
                  className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                >
                  <span>Asset</span>
                  <SortIcon field="riskScore" />
                </button>
              </th>
              <th className="table-header">
                <button 
                  onClick={() => handleSort('criticalVulns')}
                  className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                >
                  <span>Risk Level</span>
                  <SortIcon field="criticalVulns" />
                </button>
              </th>
              <th className="table-header">
                <button 
                  onClick={() => handleSort('lastSeen')}
                  className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                >
                  <span>Last Seen</span>
                  <SortIcon field="lastSeen" />
                </button>
              </th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map((asset) => {
              const AssetIcon = getAssetTypeIcon(asset.assetType);
              const riskLevel = getRiskLevel(asset.riskScore);
              
              return (
                <tr key={asset._id} className="table-row hover:bg-blue-50/50">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <AssetIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.ipAddress}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${riskLevel.color}`}>
                        {riskLevel.level}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {asset.riskScore}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(asset.lastSeen).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {assets.length === 0 && (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-400 mb-2">
            <AlertTriangle className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">No risky assets found</p>
          <p className="text-sm text-gray-400">All assets are currently within acceptable risk levels</p>
        </div>
      )}
    </div>
  );
};

export default RiskyAssetsTable;

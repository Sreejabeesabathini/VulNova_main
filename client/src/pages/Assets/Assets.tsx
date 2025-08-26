import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAssets } from '../../hooks/useApiCache';
import { Asset } from '../../types';
import { 
  Server, 
  Monitor, 
  Database, 
  Network, 
  Globe, 
  Plus, 
  Search, 
  Filter,
  Scan,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react';

const Assets: React.FC = () => {
  const { data: assetsData, isLoading } = useAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const assets = assetsData?.data || [];

  // Mock data for demonstration
  const mockAssets: Asset[] = [
    {
      _id: '1',
      name: 'Web Server - Production',
      ipAddress: '192.168.1.100',
      location: 'Data Center A - Rack 12',
      assetType: 'Server',
      riskScore: 85,
      criticalVulns: 3,
      highVulns: 7,
      mediumVulns: 12,
      lowVulns: 5,
      lastSeen: '2024-01-15T10:30:00Z',
      status: 'Active',
      tags: ['Production', 'Web Server', 'Critical', 'Internet Facing'],
      integrations: ['CrowdStrike EDR', 'Tenable Scanner', 'Active Directory']
    },
    {
      _id: '2',
      name: 'Database Server - Finance',
      ipAddress: '192.168.1.101',
      location: 'Data Center B - Rack 15',
      assetType: 'Database',
      riskScore: 72,
      criticalVulns: 1,
      highVulns: 5,
      mediumVulns: 8,
      lowVulns: 3,
      lastSeen: '2024-01-15T09:45:00Z',
      status: 'Active',
      tags: ['Production', 'Database', 'Finance', 'Critical'],
      integrations: ['CrowdStrike EDR', 'Tenable Scanner']
    },
    {
      _id: '3',
      name: 'Workstation - Marketing',
      ipAddress: '192.168.2.50',
      location: 'Office Floor 3 - Desk 12',
      assetType: 'Workstation',
      riskScore: 45,
      criticalVulns: 0,
      highVulns: 2,
      mediumVulns: 6,
      lowVulns: 4,
      lastSeen: '2024-01-15T08:30:00Z',
      status: 'Active',
      tags: ['Office', 'Workstation', 'Marketing'],
      integrations: ['CrowdStrike EDR']
    }
  ];

  const currentAssets = assets.length > 0 ? assets : mockAssets;

  const filteredAssets = currentAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.ipAddress.includes(searchTerm) ||
                         asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || asset.assetType === selectedType;
    return matchesSearch && matchesType;
  });

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'Server':
        return Server;
      case 'Workstation':
        return Monitor;
      case 'Database':
        return Database;
      case 'Network Device':
        return Network;
      case 'Web Application':
        return Globe;
      default:
        return Server;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return CheckCircle;
      case 'Inactive':
        return Clock;
      case 'Maintenance':
        return Clock;
      default:
        return Clock;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const assetTypes = ['all', 'Server', 'Workstation', 'Database', 'Network Device', 'Web Application'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Management</h1>
            <p className="text-gray-600">Monitor and manage all assets across your infrastructure</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Scan className="w-4 h-4" />
              <span>Scan Assets</span>
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Asset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Asset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Server className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{currentAssets.length}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Assets</h3>
          <p className="text-sm text-gray-600">Across all environments</p>
          <div className="mt-2 text-xs text-green-600">+5 this week</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {currentAssets.filter(a => a.status === 'Active').length}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Assets</h3>
          <p className="text-sm text-gray-600">Currently online</p>
          <div className="mt-2 text-xs text-green-600">98% uptime</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">
              {currentAssets.filter(a => a.riskScore >= 70).length}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">High Risk Assets</h3>
          <p className="text-sm text-gray-600">Require attention</p>
          <div className="mt-2 text-xs text-red-600">Immediate action</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-500">
              {currentAssets.filter(a => a.integrations.length < 2).length}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Unprotected Assets</h3>
          <p className="text-sm text-gray-600">Missing security controls</p>
          <div className="mt-2 text-xs text-orange-600">Needs EDR</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search assets by name, IP, or location..."
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
              {assetTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const Icon = getAssetTypeIcon(asset.assetType);
          const StatusIcon = getStatusIcon(asset.status);
          
          return (
            <div key={asset._id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Asset Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {asset.status}
                  </span>
                </div>

                {/* Asset Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{asset.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Network className="w-4 h-4 mr-2 text-gray-400" />
                      {asset.ipAddress}
                    </div>
                    <div className="flex items-center">
                      <Server className="w-4 h-4 mr-2 text-gray-400" />
                      {asset.assetType}
                    </div>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Risk Score</span>
                    <span className={`text-lg font-bold ${getRiskColor(asset.riskScore)}`}>
                      {asset.riskScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        asset.riskScore >= 80 ? 'bg-red-500' :
                        asset.riskScore >= 60 ? 'bg-orange-500' :
                        asset.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(asset.riskScore / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Vulnerability Summary */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{asset.criticalVulns}</div>
                    <div className="text-xs text-red-700">Critical</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{asset.highVulns}</div>
                    <div className="text-xs text-orange-700">High</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/assets/${asset._id}`}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View
                  </Link>
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
      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Add First Asset
          </button>
        </div>
      )}
    </div>
  );
};

export default Assets;

// src/pages/Assets/Assets.tsx

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAllAssets } from "../../hooks/useApiCache";
import { Asset } from "../../types";
import {
  Server,
  Monitor,
  Database,
  Network,
  Globe,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react";

const Assets: React.FC = () => {
  const { data: allAssets, isLoading } = useAllAssets(); // ✅ fetch all assets
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("all");
  const [selectedCriticality, setSelectedCriticality] = useState<string>("all");


  // ✅ Use real data from API
  const currentAssets: Asset[] = allAssets || [];
  
  // Debug logging
  console.log("🔍 Assets component debug:");
  console.log("  - isLoading:", isLoading);
  console.log("  - allAssets length:", allAssets?.length);
  console.log("  - currentAssets length:", currentAssets.length);
  console.log("  - first asset:", currentAssets[0]);

  const filteredAssets: Asset[] = currentAssets.filter((asset: Asset) => {
    const matchesSearch =
      asset.asset_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ip_address?.includes(searchTerm) ||
      asset.fqdn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.external_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || asset.asset_type === selectedType;
    const matchesEnvironment = selectedEnvironment === "all" || asset.environment === selectedEnvironment;
    const matchesCriticality = selectedCriticality === "all" || asset.criticality === selectedCriticality;
    
    return matchesSearch && matchesType && matchesEnvironment && matchesCriticality;
  });

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "Server":
        return Server;
      case "Workstation":
        return Monitor;
      case "Database":
        return Database;
      case "Network Device":
        return Network;
      case "Web Application":
        return Globe;
      default:
        return Server;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (environment: string) => {
    switch (environment) {
      case "Production":
        return CheckCircle;
      case "Development":
        return Settings;
      case "Testing":
        return Clock;
      default:
        return Clock;
    }
  };

  const getRiskColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Extract unique values from database for dynamic filtering
  const assetTypes = useMemo(() => {
    const types = ["all", ...Array.from(new Set(currentAssets.map(asset => asset.asset_type).filter(Boolean)))];
    return types;
  }, [currentAssets]);

  const environments = useMemo(() => {
    const envs = ["all", ...Array.from(new Set(currentAssets.map(asset => asset.environment).filter(Boolean)))];
    return envs;
  }, [currentAssets]);

  const criticalities = useMemo(() => {
    const crits = ["all", ...Array.from(new Set(currentAssets.map(asset => asset.criticality).filter(Boolean)))];
    return crits;
  }, [currentAssets]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse"
            >
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Asset
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border">
          <Server className="w-8 h-8 text-blue-600" />
          <p className="text-2xl font-bold">{currentAssets.length}</p>
          <p>Total Assets</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <p className="text-2xl font-bold">
            {currentAssets.filter((a: Asset) => a.environment === "Prod").length}
          </p>
          <p>Production Assets</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <p className="text-2xl font-bold">
            {currentAssets.filter((a: Asset) => a.criticality === 'Tier 1' || a.criticality === 'Tier 2').length}
          </p>
          <p>High Risk Assets</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <Shield className="w-8 h-8 text-orange-600" />
          <p className="text-2xl font-bold">
            {
              currentAssets.filter(
                (a: Asset) => (a.total_vulns ?? 0) > 10
              ).length
            }
          </p>
          <p>High Vulnerability Assets</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white p-4 rounded-xl border mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-none focus:ring-0"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          
          {/* Asset Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border rounded-lg px-3 py-2 pr-8 min-w-[140px] bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </option>
            ))}
          </select>

          {/* Environment Filter */}
          <select
            value={selectedEnvironment}
            onChange={(e) => setSelectedEnvironment(e.target.value)}
            className="border rounded-lg px-3 py-2 pr-8 min-w-[160px] bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {environments.map((env) => (
              <option key={env} value={env}>
                {env === "all" ? "All Environments" : env}
              </option>
            ))}
          </select>

          {/* Criticality Filter */}
          <select
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
            className="border rounded-lg px-3 py-2 pr-8 min-w-[160px] bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {criticalities.map((crit) => (
              <option key={crit} value={crit}>
                {crit === "all" ? "All Criticalities" : crit}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setSelectedEnvironment("all");
              setSelectedCriticality("all");
            }}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset: Asset) => {
          const Icon = getAssetTypeIcon(asset.asset_type || 'Server');
          const StatusIcon = getStatusIcon(asset.environment || 'Unknown');

          return (
            <div
              key={asset.id}
              className="bg-white p-6 rounded-xl border hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <Icon className="w-6 h-6 text-primary-600" />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    asset.environment || 'Unknown'
                  )}`}
                >
                  <StatusIcon className="w-3 h-3 inline mr-1" /> {asset.environment || 'Unknown'}
                </span>
              </div>
              <h2 className="font-semibold text-lg">{asset.asset_name}</h2>
              <p className="text-sm text-gray-600">{asset.ip_address}</p>
              <p className="text-sm text-gray-600">{asset.asset_type}</p>
              <p className={`text-sm mt-2 ${getRiskColor(asset.criticality || 'Unknown')}`}>
                Risk: {asset.criticality || 'Unknown'}
              </p>
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/assets/${asset.id}`}
                  className="bg-primary-600 text-white px-3 py-1 rounded text-sm"
                >
                  <Eye className="w-4 h-4 inline mr-1" /> View
                </Link>
                <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assets;

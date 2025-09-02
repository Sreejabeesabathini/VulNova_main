// src/pages/Assets/Assets.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAssets } from "../../hooks/useApiCache";
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
} from "lucide-react";

const Assets: React.FC = () => {
  const { data: assets, isLoading } = useAssets(); // ✅ typed already in hook
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Mock data fallback
  const mockAssets: Asset[] = [
    {
      id: "1",
      name: "Web Server - Production",
      ip_address: "192.168.1.100",
      location: "Data Center A - Rack 12",
      asset_type: "Server",
      risk_score: 85,
      critical_vulns: 3,
      high_vulns: 7,
      medium_vulns: 12,
      low_vulns: 5,
      last_seen: "2024-01-15T10:30:00Z",
      status: "Active",
      tags: ["Production", "Web Server", "Critical", "Internet Facing"],
      integrations: ["CrowdStrike EDR", "Tenable Scanner", "Active Directory"],
    },
    {
      id: "2",
      name: "Database Server - Finance",
      ip_address: "192.168.1.101",
      location: "Data Center B - Rack 15",
      asset_type: "Database",
      risk_score: 72,
      critical_vulns: 1,
      high_vulns: 5,
      medium_vulns: 8,
      low_vulns: 3,
      last_seen: "2024-01-15T09:45:00Z",
      status: "Active",
      tags: ["Production", "Database", "Finance", "Critical"],
      integrations: ["CrowdStrike EDR", "Tenable Scanner"],
    },
    {
      id: "3",
      name: "Workstation - Marketing",
      ip_address: "192.168.2.50",
      location: "Office Floor 3 - Desk 12",
      asset_type: "Workstation",
      risk_score: 45,
      critical_vulns: 0,
      high_vulns: 2,
      medium_vulns: 6,
      low_vulns: 4,
      last_seen: "2024-01-15T08:30:00Z",
      status: "Active",
      tags: ["Office", "Workstation", "Marketing"],
      integrations: ["CrowdStrike EDR"],
    },
  ];

  // ✅ Explicit typing
  const currentAssets: Asset[] =
    assets && assets.length > 0 ? assets : mockAssets;

  const filteredAssets: Asset[] = currentAssets.filter((asset: Asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ip_address.includes(searchTerm) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || asset.asset_type === selectedType;
    return matchesSearch && matchesType;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return CheckCircle;
      case "Inactive":
        return Clock;
      case "Maintenance":
        return Clock;
      default:
        return Clock;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-orange-600";
    if (score >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const assetTypes = [
    "all",
    "Server",
    "Workstation",
    "Database",
    "Network Device",
    "Web Application",
  ];

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
            {currentAssets.filter((a: Asset) => a.status === "Active").length}
          </p>
          <p>Active Assets</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <p className="text-2xl font-bold">
            {currentAssets.filter((a: Asset) => a.risk_score >= 70).length}
          </p>
          <p>High Risk Assets</p>
        </div>
        <div className="bg-white rounded-xl p-6 border">
          <Shield className="w-8 h-8 text-orange-600" />
          <p className="text-2xl font-bold">
            {
              currentAssets.filter(
                (a: Asset) => (a.integrations?.length ?? 0) < 2
              ).length
            }
          </p>
          <p>Unprotected Assets</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white p-4 rounded-xl border flex items-center space-x-4 mb-6">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-none focus:ring-0"
        />
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded-lg p-2"
        >
          {assetTypes.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? "All Types" : type}
            </option>
          ))}
        </select>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset: Asset) => {
          const Icon = getAssetTypeIcon(asset.asset_type);
          const StatusIcon = getStatusIcon(asset.status);

          return (
            <div
              key={asset.id}
              className="bg-white p-6 rounded-xl border hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <Icon className="w-6 h-6 text-primary-600" />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    asset.status
                  )}`}
                >
                  <StatusIcon className="w-3 h-3 inline mr-1" /> {asset.status}
                </span>
              </div>
              <h2 className="font-semibold text-lg">{asset.name}</h2>
              <p className="text-sm text-gray-600">{asset.ip_address}</p>
              <p className="text-sm text-gray-600">{asset.asset_type}</p>
              <p className={`text-sm mt-2 ${getRiskColor(asset.risk_score)}`}>
                Risk: {asset.risk_score}
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

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '../../services/api';
import { Asset } from '../../types';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Eye,
  Shield,
  Server,
  Monitor,
  Database,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw,
  Activity,
  User,
  Tag,
  Calendar,
  MapPin,
  Network,
} from 'lucide-react';

const AssetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'activity' | 'integrations'>('overview');

  // ✅ use getAsset, not getById
  const { data: assetData, isLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => assetsApi.getAsset(id!),
    enabled: !!id,
  });

  // ✅ Use real data from API
  const currentAsset: Asset | undefined = assetData;

  if (isLoading) {
    return <div className="p-6">Loading asset details...</div>;
  }

  if (!currentAsset) {
    return <div className="p-6">Asset not found</div>;
  }

  const vulnerabilityData = [
    { severity: 'Critical', count: currentAsset.critical_vulns || 0, color: 'bg-red-500' },
    { severity: 'High', count: currentAsset.high_vulns || 0, color: 'bg-orange-500' },
    { severity: 'Medium', count: currentAsset.medium_vulns || 0, color: 'bg-yellow-500' },
    { severity: 'Low', count: currentAsset.low_vulns || 0, color: 'bg-green-500' },
  ];

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
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return CheckCircle;
      case 'Inactive':
        return Clock;
      case 'Maintenance':
        return Settings;
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

  const getRiskStatus = (criticality: string) => {
    return criticality || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentAsset) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Asset Not Found</h2>
        <p className="text-gray-600 mb-6">The requested asset could not be found.</p>
        <button onClick={() => navigate('/assets')} className="btn-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assets
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Example: Risk Score card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
            {React.createElement(getAssetTypeIcon(currentAsset.asset_type || 'Server'), { className: 'w-6 h-6 text-primary-600' })}
          </div>
          <span className={`text-2xl font-bold ${getRiskColor(currentAsset.criticality || 'Unknown')}`}>
            {currentAsset.total_vulns || 0}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Vulnerabilities</h3>
        <p className="text-sm text-gray-600">{getRiskStatus(currentAsset.criticality || 'Unknown')} Risk</p>
        <div className="mt-2 text-xs text-gray-500">
          Last updated: {new Date(currentAsset.updated_at || '').toLocaleDateString()}
        </div>
      </div>

      {/* Example: Tags */}
      <div>
        <label className="text-sm font-medium text-gray-500">Tags</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {currentAsset.tags?.split(',').map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;

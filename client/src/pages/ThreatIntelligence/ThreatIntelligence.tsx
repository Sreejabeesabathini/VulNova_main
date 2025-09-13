import React, { useMemo, useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  RefreshCw,
  Activity,
  Target,
  Globe,
  Server,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Lock,
  Unlock,
  BarChart3,
  PieChart
} from 'lucide-react';
import { threatIntelApi } from '../../services/api';

const ThreatIntelligence: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Live data
  const [summary, setSummary] = React.useState<{ total: number; active: number; critical: number; contained: number }>({ total: 0, active: 0, critical: 0, contained: 0 });
  const [threats, setThreats] = React.useState<any[]>([]);
  const [trends, setTrends] = React.useState<{ malware?: any; phishing?: any; ransomware?: any; apt?: any }>({});

  React.useEffect(() => {
    (async () => {
      try {
        const s = await threatIntelApi.getSummary();
        setSummary(s);
        const t = await threatIntelApi.getTrends();
        setTrends(t);
      } catch {}
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await threatIntelApi.getThreats({
          search: searchTerm || undefined,
          severity: selectedSeverity !== 'all' ? selectedSeverity : undefined,
          type: selectedType !== 'all' ? selectedType : undefined,
          page: 1,
          limit: 10,
        });
        setThreats(res.data || []);
      } catch {}
    })();
  }, [searchTerm, selectedSeverity, selectedType]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Malware':
        return Shield;
      case 'Phishing':
        return Users;
      case 'Ransomware':
        return Lock;
      case 'APT':
        return Target;
      case 'DDoS':
        return Activity;
      case 'Insider':
        return Users;
      case 'Supply Chain':
        return Server;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Contained':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'False Positive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    if (confidence >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const threatTypes = ['all', 'Malware', 'Phishing', 'Ransomware', 'APT', 'DDoS', 'Insider', 'Supply Chain'];
  const threatSeverities = ['all', 'Critical', 'High', 'Medium', 'Low'];

  const summaryData = {
    total: summary.total,
    active: summary.active,
    critical: summary.critical,
    contained: summary.contained,
  };

  const threatTrends = {
    malware: { trend: trends.malware?.trend || 'stable', percentage: trends.malware?.percentage ?? 0 },
    phishing: { trend: trends.phishing?.trend || 'stable', percentage: trends.phishing?.percentage ?? 0 },
    ransomware: { trend: trends.ransomware?.trend || 'stable', percentage: trends.ransomware?.percentage ?? 0 },
    apt: { trend: trends.apt?.trend || 'stable', percentage: trends.apt?.percentage ?? 0 }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Threat Intelligence</h1>
            <p className="text-gray-600">Monitor, analyze, and respond to emerging security threats</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Update Intel</span>
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Threat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Threat Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{summaryData.total}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Threats</h3>
          <p className="text-sm text-gray-600">All detected threats</p>
          <div className="mt-2 text-xs text-red-600">Monitoring</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-600">{summaryData.active}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Threats</h3>
          <p className="text-sm text-gray-600">Currently active</p>
          <div className="mt-2 text-xs text-orange-600">Immediate action</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{summaryData.critical}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Critical</h3>
          <p className="text-sm text-gray-600">High priority</p>
          <div className="mt-2 text-xs text-red-600">Urgent</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{summaryData.contained}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Contained</h3>
          <p className="text-sm text-gray-600">Under control</p>
          <div className="mt-2 text-xs text-green-600">Managed</div>
        </div>
      </div>

      {/* Threat Trends */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Threat Trends</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-red-50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Malware</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{trends.malware?.trend === 'down' ? '-' : '+'}{trends.malware?.percentage ?? 0}%</div>
            <div className="text-xs text-red-600">vs last week</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Phishing</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{trends.phishing?.trend === 'up' ? '+' : '-'}{trends.phishing?.percentage ?? 0}%</div>
            <div className="text-xs text-green-600">vs last week</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-red-50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Ransomware</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{trends.ransomware?.trend === 'down' ? '-' : '+'}{trends.ransomware?.percentage ?? 0}%</div>
            <div className="text-xs text-red-600">vs last week</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">APT</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{trends.apt?.percentage ?? 0}%</div>
            <div className="text-xs text-blue-600">vs last week</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search threats by name, description, or source..."
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
              {['all', 'Malware', 'Phishing', 'Ransomware', 'APT', 'DDoS', 'Insider', 'Supply Chain'].map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              {['all', 'Critical', 'High', 'Medium', 'Low'].map(severity => (
                <option key={severity} value={severity}>
                  {severity === 'all' ? 'All Severities' : severity}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Threats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {threats.map((threat) => {
          const TypeIcon = getTypeIcon(threat.type);
          const sev = threat.severity || 'Medium';
          const st = threat.status || 'Active';
          return (
            <div key={threat.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Threat Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(sev)}`}>
                      {sev}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(st)}`}>
                      {st}
                    </span>
                  </div>
                </div>

                {/* Threat Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{threat.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{threat.description}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Source:</span>
                      <span className="font-medium">{threat.source}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Target:</span>
                      <span className="font-medium">{threat.target}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Affected Assets:</span>
                      <span className="font-medium">{threat.affectedAssets}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Confidence:</span>
                      <span className={`font-medium ${getConfidenceColor(threat.confidence || 80)}`}>
                        {threat.confidence || 80}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Indicators */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Indicators</h4>
                  <div className="flex flex-wrap gap-1">
                    {(threat.indicators || []).slice(0, 2).map((indicator: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {indicator}
                      </span>
                    ))}
                    {(threat.indicators || []).length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{(threat.indicators || []).length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-4">
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>First Seen:</span>
                      <span>{threat.firstSeen ? new Date(threat.firstSeen).toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Seen:</span>
                      <span>{threat.lastSeen ? new Date(threat.lastSeen).toLocaleDateString() : '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Eye className="w-4 h-4 inline mr-1" />
                    View Details
                  </button>
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
      {threats.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No threats found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Add First Threat
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreatIntelligence;

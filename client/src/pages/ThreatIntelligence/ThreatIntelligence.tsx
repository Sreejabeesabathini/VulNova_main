import React, { useState } from 'react';
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

interface Threat {
  _id: string;
  name: string;
  type: 'Malware' | 'Phishing' | 'Ransomware' | 'APT' | 'DDoS' | 'Insider' | 'Supply Chain';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Contained' | 'Resolved' | 'False Positive';
  source: string;
  target: string;
  firstSeen: string;
  lastSeen: string;
  affectedAssets: number;
  description: string;
  indicators: string[];
  mitigation: string;
  confidence: number;
}

const ThreatIntelligence: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Mock data for demonstration
  const mockThreats: Threat[] = [
    {
      _id: '1',
      name: 'Emotet Banking Trojan',
      type: 'Malware',
      severity: 'High',
      status: 'Active',
      source: 'External',
      target: 'Financial Systems',
      firstSeen: '2024-01-10T08:00:00Z',
      lastSeen: '2024-01-15T14:30:00Z',
      affectedAssets: 23,
      description: 'Advanced banking trojan targeting financial institutions with sophisticated evasion techniques',
      indicators: ['emotet.exe', '192.168.1.100:443', 'C&C: evil.com'],
      mitigation: 'Update antivirus signatures, block suspicious domains, monitor network traffic',
      confidence: 95
    },
    {
      _id: '2',
      name: 'Phishing Campaign - Office 365',
      type: 'Phishing',
      severity: 'Medium',
      status: 'Contained',
      source: 'External',
      target: 'User Accounts',
      firstSeen: '2024-01-12T10:15:00Z',
      lastSeen: '2024-01-14T16:45:00Z',
      affectedAssets: 8,
      description: 'Targeted phishing campaign impersonating Microsoft Office 365 login',
      indicators: ['phish.office365.fake', 'office365-login.com.fake', 'microsoft-support.fake'],
      mitigation: 'User training, email filtering, MFA enforcement',
      confidence: 88
    },
    {
      _id: '3',
      name: 'Ransomware - LockBit 3.0',
      type: 'Ransomware',
      severity: 'Critical',
      status: 'Active',
      source: 'External',
      target: 'File Servers',
      firstSeen: '2024-01-15T02:30:00Z',
      lastSeen: '2024-01-15T14:30:00Z',
      affectedAssets: 156,
      description: 'Advanced ransomware variant with double extortion capabilities',
      indicators: ['lockbit.exe', 'encrypted files', 'ransom note', 'C&C: lockbit.com'],
      mitigation: 'Isolate affected systems, restore from backups, contact law enforcement',
      confidence: 92
    },
    {
      _id: '4',
      name: 'APT Group - Lazarus',
      type: 'APT',
      severity: 'Critical',
      status: 'Active',
      source: 'Nation State',
      target: 'Critical Infrastructure',
      firstSeen: '2024-01-08T12:00:00Z',
      lastSeen: '2024-01-15T14:30:00Z',
      affectedAssets: 45,
      description: 'Advanced Persistent Threat group with sophisticated attack techniques',
      indicators: ['lazarus.dll', 'C&C: 185.220.101.45', 'custom malware'],
      mitigation: 'Advanced threat hunting, network segmentation, threat intelligence sharing',
      confidence: 78
    },
    {
      _id: '5',
      name: 'DDoS Attack - Network Layer',
      type: 'DDoS',
      severity: 'Medium',
      status: 'Resolved',
      source: 'External',
      target: 'Network Infrastructure',
      firstSeen: '2024-01-13T18:00:00Z',
      lastSeen: '2024-01-13T22:00:00Z',
      affectedAssets: 0,
      description: 'Distributed Denial of Service attack targeting network infrastructure',
      indicators: ['UDP flood', 'SYN flood', 'multiple source IPs'],
      mitigation: 'DDoS protection services, traffic filtering, rate limiting',
      confidence: 85
    }
  ];

  const filteredThreats = mockThreats.filter(threat => {
    const matchesSearch = threat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || threat.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || threat.severity === selectedSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

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
    total: mockThreats.length,
    active: mockThreats.filter(t => t.status === 'Active').length,
    critical: mockThreats.filter(t => t.severity === 'Critical').length,
    contained: mockThreats.filter(t => t.status === 'Contained').length
  };

  const threatTrends = {
    malware: { trend: 'up', percentage: 15 },
    phishing: { trend: 'down', percentage: 8 },
    ransomware: { trend: 'up', percentage: 23 },
    apt: { trend: 'stable', percentage: 0 }
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
            <div className="text-2xl font-bold text-red-600">+{threatTrends.malware.percentage}%</div>
            <div className="text-xs text-red-600">vs last week</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Phishing</span>
            </div>
            <div className="text-2xl font-bold text-green-600">-{threatTrends.phishing.percentage}%</div>
            <div className="text-xs text-green-600">vs last week</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-red-50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Ransomware</span>
            </div>
            <div className="text-2xl font-bold text-red-600">+{threatTrends.ransomware.percentage}%</div>
            <div className="text-xs text-red-600">vs last week</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">APT</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">0%</div>
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
              {threatTypes.map(type => (
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
              {threatSeverities.map(severity => (
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
        {filteredThreats.map((threat) => {
          const TypeIcon = getTypeIcon(threat.type);
          
          return (
            <div key={threat._id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Threat Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(threat.status)}`}>
                      {threat.status}
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
                      <span className={`font-medium ${getConfidenceColor(threat.confidence)}`}>
                        {threat.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Indicators */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Indicators</h4>
                  <div className="flex flex-wrap gap-1">
                    {threat.indicators.slice(0, 2).map((indicator, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {indicator}
                      </span>
                    ))}
                    {threat.indicators.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{threat.indicators.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-4">
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>First Seen:</span>
                      <span>{new Date(threat.firstSeen).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Seen:</span>
                      <span>{new Date(threat.lastSeen).toLocaleDateString()}</span>
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
      {filteredThreats.length === 0 && (
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

import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  Search, 
  GitBranch, 
  Link, 
  Layers, 
  AlertTriangle,
  MousePointerClick,
  Network,
  Info,
  Eye,
  Filter,
  Settings,
  BarChart3,
  Activity,
  Shield,
  Server,
  Monitor,
  Database,
  Globe
} from 'lucide-react';

interface GraphNode {
  id: string;
  name: string;
  type: 'server' | 'workstation' | 'database' | 'network' | 'web';
  risk: 'low' | 'medium' | 'high' | 'critical';
  status: 'online' | 'offline' | 'maintenance';
  x: number;
  y: number;
}

interface GraphConnection {
  source: string;
  target: string;
  type: 'network' | 'dependency' | 'communication';
  risk: 'low' | 'medium' | 'high' | 'critical';
}

const AssetsGraph: React.FC = () => {
  const [selectedView, setSelectedView] = useState('network');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLayout, setSelectedLayout] = useState('force');
  const [selectedAsset, setSelectedAsset] = useState<GraphNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const mockNodes: GraphNode[] = [
    { id: '1', name: 'Web-Server-01', type: 'server', risk: 'high', status: 'online', x: 100, y: 100 },
    { id: '2', name: 'DB-Server-01', type: 'database', risk: 'critical', status: 'online', x: 300, y: 100 },
    { id: '3', name: 'Workstation-45', type: 'workstation', risk: 'medium', status: 'online', x: 200, y: 200 },
    { id: '4', name: 'Router-01', type: 'network', risk: 'low', status: 'online', x: 150, y: 50 },
    { id: '5', name: 'DMZ-Server-02', type: 'server', risk: 'high', status: 'online', x: 400, y: 150 },
  ];

  const mockConnections: GraphConnection[] = [
    { source: '1', target: '2', type: 'dependency', risk: 'critical' },
    { source: '3', target: '1', type: 'communication', risk: 'medium' },
    { source: '4', target: '1', type: 'network', risk: 'low' },
    { source: '1', target: '5', type: 'communication', risk: 'high' },
  ];

  const graphStats = {
    totalNodes: 1247,
    connections: 3456,
    networkSegments: 12,
    riskPaths: 23
  };

  const riskPaths = [
    { path: 'DB-Server-01 → Web-Server-03', risk: 'critical', description: 'Critical path detected' },
    { path: 'Workstation-45 → DMZ-Server-02', risk: 'high', description: 'Unusual connection' },
    { path: 'Web-Server-01 → External-API', risk: 'medium', description: 'New connection' }
  ];

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    setIsLoading(true);
    // Simulate loading for view change
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setIsLoading(true);
    // Simulate loading for filter change
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleLayoutChange = (layout: string) => {
    setSelectedLayout(layout);
    setIsLoading(true);
    // Simulate loading for layout change
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    alert('Exporting graph data...');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleAssetClick = (node: GraphNode) => {
    setSelectedAsset(node);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'workstation': return Monitor;
      case 'database': return Database;
      case 'network': return Network;
      case 'web': return Globe;
      default: return Server;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Relationship Graph</h1>
            <p className="text-gray-600">Visualize connections and dependencies between your assets</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Graph</span>
            </button>
            <button 
              onClick={handleRefresh}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Graph Controls */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">View:</label>
            <select 
              value={selectedView}
              onChange={(e) => handleViewChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="network">Network Topology</option>
              <option value="risk">Risk Relationships</option>
              <option value="dependency">Dependency Map</option>
              <option value="communication">Communication Flow</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select 
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Assets</option>
              <option value="critical">Critical Assets Only</option>
              <option value="high">High Risk Assets</option>
              <option value="servers">Servers Only</option>
              <option value="network">Network Devices</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Layout:</label>
            <select 
              value={selectedLayout}
              onChange={(e) => handleLayoutChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="force">Force-Directed</option>
              <option value="hierarchical">Hierarchical</option>
              <option value="circular">Circular</option>
              <option value="grid">Grid</option>
            </select>
          </div>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Find Asset</span>
          </button>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Network Topology</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Servers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Workstations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Network Devices</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Critical Risk</span>
            </div>
          </div>
        </div>
        
        <div 
          ref={graphRef}
          className="w-full h-96 border border-gray-200 rounded-lg bg-gray-50 relative overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Mock Graph Nodes */}
              {mockNodes.map((node) => {
                const Icon = getTypeIcon(node.type);
                return (
                  <div
                    key={node.id}
                    onClick={() => handleAssetClick(node)}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: node.x, top: node.y }}
                  >
                    <div className={`w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${
                      node.risk === 'critical' ? 'bg-red-500' :
                      node.risk === 'high' ? 'bg-orange-500' :
                      node.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-xs text-center mt-2 font-medium text-gray-700 bg-white px-2 py-1 rounded shadow">
                      {node.name}
                    </div>
                  </div>
                );
              })}
              
              {/* Mock Graph Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {mockConnections.map((conn, index) => {
                  const source = mockNodes.find(n => n.id === conn.source);
                  const target = mockNodes.find(n => n.id === conn.target);
                  if (!source || !target) return null;
                  
                  return (
                    <line
                      key={index}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={conn.risk === 'critical' ? '#ef4444' : 
                              conn.risk === 'high' ? '#f97316' : 
                              conn.risk === 'medium' ? '#eab308' : '#22c55e'}
                      strokeWidth={conn.risk === 'critical' ? 3 : 2}
                      strokeDasharray={conn.type === 'dependency' ? '5,5' : 'none'}
                    />
                  );
                })}
              </svg>
            </>
          )}
        </div>
      </div>

      {/* Graph Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <GitBranch className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{graphStats.totalNodes.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Nodes</h3>
          <p className="text-sm text-gray-600">Assets in graph</p>
          <div className="mt-2 text-xs text-green-600">+23 new nodes</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{graphStats.connections.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Connections</h3>
          <p className="text-sm text-gray-600">Asset relationships</p>
          <div className="mt-2 text-xs text-green-600">+89 new connections</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Layers className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{graphStats.networkSegments}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Network Segments</h3>
          <p className="text-sm text-gray-600">Isolated groups</p>
          <div className="mt-2 text-xs text-blue-600">3 critical segments</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{graphStats.riskPaths}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Risk Paths</h3>
          <p className="text-sm text-gray-600">High-risk connections</p>
          <div className="mt-2 text-xs text-red-600">Require attention</div>
        </div>
      </div>

      {/* Asset Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Asset Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Asset Details</h2>
            <Info className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {selectedAsset ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedAsset.risk === 'critical' ? 'bg-red-100' :
                    selectedAsset.risk === 'high' ? 'bg-orange-100' :
                    selectedAsset.risk === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    {React.createElement(getTypeIcon(selectedAsset.type), { 
                      className: `w-8 h-8 ${
                        selectedAsset.risk === 'critical' ? 'text-red-600' :
                        selectedAsset.risk === 'high' ? 'text-orange-600' :
                        selectedAsset.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`
                    })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedAsset.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{selectedAsset.type}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Risk Level</label>
                    <p className={`text-sm font-medium ${getRiskColor(selectedAsset.risk)} capitalize`}>
                      {selectedAsset.risk}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-sm font-medium text-gray-900 capitalize">{selectedAsset.status}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <MousePointerClick className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Click on a node in the graph to view asset details</p>
              </div>
            )}
          </div>
        </div>

        {/* Connection Analysis */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Connection Analysis</h2>
            <Network className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {riskPaths.map((path, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                path.risk === 'critical' ? 'bg-red-50 border-red-200' :
                path.risk === 'high' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    path.risk === 'critical' ? 'text-red-600' :
                    path.risk === 'high' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                  <div>
                    <div className={`font-medium ${
                      path.risk === 'critical' ? 'text-red-900' :
                      path.risk === 'high' ? 'text-yellow-900' : 'text-blue-900'
                    }`}>{path.description}</div>
                    <div className={`text-sm ${
                      path.risk === 'critical' ? 'text-red-700' :
                      path.risk === 'high' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>{path.path}</div>
                  </div>
                </div>
                <button className={`text-sm font-medium ${
                  path.risk === 'critical' ? 'text-red-600 hover:text-red-800' :
                  path.risk === 'high' ? 'text-yellow-600 hover:text-yellow-800' :
                  'text-blue-600 hover:text-blue-800'
                }`}>
                  {path.risk === 'critical' ? 'Investigate' : 'Review'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsGraph;

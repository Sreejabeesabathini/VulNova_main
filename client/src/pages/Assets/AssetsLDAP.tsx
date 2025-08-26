import React, { useState } from 'react';
import { 
  RefreshCw, 
  Plus, 
  Users, 
  Building, 
  Laptop, 
  Clock, 
  Settings, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Server,
  Database,
  Network,
  Globe,
  Zap,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Info,
  Target,
  Shield,
  HardDrive,
  Mail
} from 'lucide-react';

interface LDAPServer {
  id: string;
  name: string;
  hostname: string;
  port: number;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  type: 'Active Directory' | 'OpenLDAP' | 'FreeIPA' | 'Other';
  lastSync: string;
  users: number;
  groups: number;
  computers: number;
  organizationalUnits: number;
}

interface LDAPUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  department: string;
  status: 'active' | 'inactive' | 'locked' | 'expired';
  lastLogin: string;
  groups: string[];
  manager: string;
}

interface LDAPGroup {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'distribution' | 'universal';
  members: number;
  scope: 'local' | 'global' | 'universal';
  created: string;
  lastModified: string;
}

interface LDAPComputer {
  id: string;
  name: string;
  operatingSystem: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: string;
  ipAddress: string;
  department: string;
  owner: string;
}

const AssetsLDAP: React.FC = () => {
  const [selectedServer, setSelectedServer] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockLDAPServers: LDAPServer[] = [
    {
      id: '1',
      name: 'DC-01',
      hostname: 'dc01.company.local',
      port: 389,
      status: 'online',
      type: 'Active Directory',
      lastSync: '2 minutes ago',
      users: 1247,
      groups: 89,
      computers: 856,
      organizationalUnits: 23
    },
    {
      id: '2',
      name: 'DC-02',
      hostname: 'dc02.company.local',
      port: 389,
      status: 'online',
      type: 'Active Directory',
      lastSync: '5 minutes ago',
      users: 1209,
      groups: 87,
      computers: 823,
      organizationalUnits: 22
    },
    {
      id: '3',
      name: 'LDAP-Dev',
      hostname: 'ldap-dev.company.local',
      port: 389,
      status: 'maintenance',
      type: 'OpenLDAP',
      lastSync: '1 hour ago',
      users: 156,
      groups: 12,
      computers: 45,
      organizationalUnits: 8
    }
  ];

  const mockLDAPUsers: LDAPUser[] = [
    {
      id: '1',
      username: 'john.doe',
      displayName: 'John Doe',
      email: 'john.doe@company.com',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-15 10:30:00',
      groups: ['IT Users', 'Administrators', 'VPN Users'],
      manager: 'jane.smith'
    },
    {
      id: '2',
      username: 'jane.smith',
      displayName: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-15 09:15:00',
      groups: ['IT Users', 'Administrators', 'VPN Users'],
      manager: 'bob.johnson'
    },
    {
      id: '3',
      username: 'bob.johnson',
      displayName: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      department: 'Finance',
      status: 'active',
      lastLogin: '2024-01-15 08:45:00',
      groups: ['Finance Users', 'VPN Users'],
      manager: 'alice.brown'
    }
  ];

  const mockLDAPGroups: LDAPGroup[] = [
    {
      id: '1',
      name: 'IT Users',
      description: 'Information Technology department users',
      type: 'security',
      members: 45,
      scope: 'global',
      created: '2020-01-01',
      lastModified: '2024-01-10'
    },
    {
      id: '2',
      name: 'Administrators',
      description: 'System administrators with elevated privileges',
      type: 'security',
      members: 12,
      scope: 'global',
      created: '2020-01-01',
      lastModified: '2024-01-08'
    },
    {
      id: '3',
      name: 'Finance Users',
      description: 'Finance department users',
      type: 'security',
      members: 23,
      scope: 'global',
      created: '2020-01-01',
      lastModified: '2024-01-05'
    }
  ];

  const mockLDAPComputers: LDAPComputer[] = [
    {
      id: '1',
      name: 'WS-IT-001',
      operatingSystem: 'Windows 11 Pro',
      status: 'online',
      lastSeen: '2 minutes ago',
      ipAddress: '192.168.1.100',
      department: 'IT',
      owner: 'john.doe'
    },
    {
      id: '2',
      name: 'WS-FIN-001',
      operatingSystem: 'Windows 10 Pro',
      status: 'online',
      lastSeen: '5 minutes ago',
      ipAddress: '192.168.1.101',
      department: 'Finance',
      owner: 'bob.johnson'
    },
    {
      id: '3',
      name: 'SRV-WEB-01',
      operatingSystem: 'Windows Server 2022',
      status: 'online',
      lastSeen: '1 minute ago',
      ipAddress: '192.168.1.200',
      department: 'IT',
      owner: 'jane.smith'
    }
  ];

  const summaryData = {
    directoryUsers: 2456,
    organizationalUnits: 45,
    computerObjects: 1247,
    lastSync: '5m'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'offline': return XCircle;
      case 'maintenance': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return XCircle;
    }
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'locked': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComputerStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return Shield;
      case 'distribution': return Users;
      case 'universal': return Globe;
      default: return Users;
    }
  };

  const handleSyncDirectory = () => {
    alert('Syncing LDAP directory...');
  };

  const handleAddLDAP = () => {
    alert('Add LDAP server form will open...');
  };

  const handleEditServer = (server: LDAPServer) => {
    alert(`Edit server: ${server.name}`);
  };

  const handleDeleteServer = (server: LDAPServer) => {
    if (window.confirm(`Are you sure you want to delete the LDAP server "${server.name}"?`)) {
      alert(`Server "${server.name}" deleted`);
    }
  };

  const filteredServers = mockLDAPServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.hostname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedServer === 'all' || server.status === selectedServer;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LDAP Directory Services</h1>
            <p className="text-gray-600">Manage LDAP connections and directory synchronization for asset management</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleSyncDirectory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Directory</span>
            </button>
            <button 
              onClick={handleAddLDAP}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add LDAP</span>
            </button>
          </div>
        </div>
      </div>

      {/* LDAP Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.directoryUsers.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Directory Users</h3>
          <p className="text-sm text-gray-600">Synchronized accounts</p>
          <div className="mt-2 text-xs text-green-600">+23 new users</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Building className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.organizationalUnits}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Organizational Units</h3>
          <p className="text-sm text-gray-600">Active OUs</p>
          <div className="mt-2 text-xs text-blue-600">12 departments</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Laptop className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.computerObjects.toLocaleString()}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Computer Objects</h3>
          <p className="text-sm text-gray-600">Managed devices</p>
          <div className="mt-2 text-xs text-green-600">98.5% online</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.lastSync}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Last Sync</h3>
          <p className="text-sm text-gray-600">Directory update</p>
          <div className="mt-2 text-xs text-green-600">Auto-sync enabled</div>
        </div>
      </div>

      {/* LDAP Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Active LDAP Servers */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">LDAP Servers</h2>
            <Server className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {mockLDAPServers.map((server) => {
              const StatusIcon = getStatusIcon(server.status);
              return (
                <div key={server.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{server.name}</h3>
                      <p className="text-xs text-gray-500">{server.hostname}:{server.port}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(server.status)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {server.status}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{server.users} users</p>
                      <p className="text-xs text-gray-500">{server.computers} computers</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Directory Statistics */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Directory Statistics</h2>
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mockLDAPServers[0].users}</div>
                <div className="text-sm text-blue-700">Total Users</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{mockLDAPServers[0].groups}</div>
                <div className="text-sm text-green-700">Total Groups</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{mockLDAPServers[0].computers}</div>
                <div className="text-sm text-purple-700">Computers</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{mockLDAPServers[0].organizationalUnits}</div>
                <div className="text-sm text-orange-700">OUs</div>
              </div>
            </div>
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
              placeholder="Search LDAP servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* LDAP Servers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredServers.map((server) => {
          const StatusIcon = getStatusIcon(server.status);
          return (
            <div key={server.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                {/* Server Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Server className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(server.status)}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {server.status}
                  </span>
                </div>

                {/* Server Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{server.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Hostname:</span>
                      <span className="font-medium">{server.hostname}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Port:</span>
                      <span className="font-medium">{server.port}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Type:</span>
                      <span className="font-medium">{server.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Users:</span>
                      <span className="font-medium">{server.users.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{server.groups}</div>
                      <div className="text-xs text-green-700">Groups</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{server.computers}</div>
                      <div className="text-xs text-purple-700">Computers</div>
                    </div>
                  </div>
                </div>

                {/* Last Sync */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last sync:</span>
                    <span>{server.lastSync}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditServer(server)}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteServer(server)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Directory Objects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Users */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            {mockLDAPUsers.map((user) => (
              <div key={user.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{user.displayName}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUserStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{user.email}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{user.department}</span>
                  <span>{user.lastLogin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Groups */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Groups</h2>
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-3">
            {mockLDAPGroups.map((group) => (
              <div key={group.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {React.createElement(getGroupTypeIcon(group.type), { className: "w-4 h-4 text-primary-600" })}
                  <span className="text-sm font-medium text-gray-900">{group.name}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{group.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{group.members} members</span>
                  <span className="capitalize">{group.scope}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Computers */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Computers</h2>
            <Laptop className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-3">
            {mockLDAPComputers.map((computer) => (
              <div key={computer.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{computer.name}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComputerStatusColor(computer.status)}`}>
                    {computer.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{computer.operatingSystem}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{computer.department}</span>
                  <span>{computer.lastSeen}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Synchronization Status */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Synchronization Status</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Check Status</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockLDAPServers.map((server) => (
            <div key={server.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{server.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                  {React.createElement(getStatusIcon(server.status), { className: "w-3 h-3 mr-1" })}
                  {server.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span>{server.lastSync}</span>
                </div>
                <div className="flex justify-between">
                  <span>Users:</span>
                  <span>{server.users.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Computers:</span>
                  <span>{server.computers.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetsLDAP;

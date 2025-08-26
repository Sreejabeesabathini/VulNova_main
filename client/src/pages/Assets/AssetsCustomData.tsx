import React, { useState } from 'react';
import { 
  Upload, 
  Plus, 
  FileText, 
  Database, 
  Link2, 
  Clock, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  RefreshCw,
  FileSpreadsheet,
  Code,
  Globe,
  Server
} from 'lucide-react';

interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  description: string;
  required: boolean;
  validation: string;
  defaultValue: string;
  createdAt: string;
  usageCount: number;
}

interface DataSource {
  id: string;
  name: string;
  type: 'csv' | 'api' | 'database' | 'manual';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  recordCount: number;
  fields: string[];
}

interface ImportHistory {
  id: string;
  source: string;
  records: number;
  status: 'success' | 'failed' | 'partial';
  timestamp: string;
  errors: number;
}

const AssetsCustomData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fields' | 'history' | 'sources' | 'validation'>('fields');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data for demonstration
  const mockCustomFields: CustomField[] = [
    {
      id: '1',
      name: 'Department',
      type: 'select',
      description: 'Organizational department assignment',
      required: true,
      validation: 'Must be valid department code',
      defaultValue: 'IT',
      createdAt: '2024-01-15',
      usageCount: 1247
    },
    {
      id: '2',
      name: 'Cost Center',
      type: 'text',
      description: 'Financial cost center code',
      required: false,
      validation: 'Alphanumeric, 6 characters',
      defaultValue: '',
      createdAt: '2024-01-10',
      usageCount: 856
    },
    {
      id: '3',
      name: 'Warranty Expiry',
      type: 'date',
      description: 'Hardware warranty expiration date',
      required: false,
      validation: 'Future date only',
      defaultValue: '',
      createdAt: '2024-01-05',
      usageCount: 623
    },
    {
      id: '4',
      name: 'Critical Asset',
      type: 'boolean',
      description: 'Flag for business-critical assets',
      required: true,
      validation: 'Boolean value only',
      defaultValue: 'false',
      createdAt: '2024-01-01',
      usageCount: 234
    }
  ];

  const mockDataSources: DataSource[] = [
    {
      id: '1',
      name: 'HR Employee Database',
      type: 'database',
      status: 'active',
      lastSync: '2 minutes ago',
      recordCount: 847,
      fields: ['Employee ID', 'Department', 'Cost Center', 'Manager']
    },
    {
      id: '2',
      name: 'Asset Management CSV',
      type: 'csv',
      status: 'active',
      lastSync: '1 hour ago',
      recordCount: 156,
      fields: ['Asset Tag', 'Location', 'Purchase Date', 'Vendor']
    },
    {
      id: '3',
      name: 'Finance API',
      type: 'api',
      status: 'active',
      lastSync: '30 minutes ago',
      recordCount: 89,
      fields: ['Cost Center', 'Budget Code', 'Expense Category']
    }
  ];

  const mockImportHistory: ImportHistory[] = [
    {
      id: '1',
      source: 'HR Employee Database',
      records: 847,
      status: 'success',
      timestamp: '2024-01-15 10:30:00',
      errors: 0
    },
    {
      id: '2',
      source: 'Asset Management CSV',
      records: 156,
      status: 'success',
      timestamp: '2024-01-15 09:15:00',
      errors: 0
    },
    {
      id: '3',
      source: 'Finance API',
      records: 89,
      status: 'partial',
      timestamp: '2024-01-15 08:45:00',
      errors: 3
    }
  ];

  const summaryData = {
    csvRecords: 847,
    customFields: 23,
    apiConnections: 12,
    lastSync: '15m'
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'csv': return FileSpreadsheet;
      case 'api': return Code;
      case 'database': return Database;
      case 'manual': return Server;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return XCircle;
      case 'error': return AlertTriangle;
      default: return XCircle;
    }
  };

  const getImportStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'failed': return XCircle;
      case 'partial': return AlertTriangle;
      default: return XCircle;
    }
  };

  const handleCreateField = () => {
    alert('Create custom field form will open...');
  };

  const handleImportData = () => {
    alert('Import data dialog will open...');
  };

  const handleEditField = (field: CustomField) => {
    alert(`Edit field: ${field.name}`);
  };

  const handleDeleteField = (field: CustomField) => {
    if (window.confirm(`Are you sure you want to delete the field "${field.name}"?`)) {
      alert(`Field "${field.name}" deleted`);
    }
  };

  const filteredFields = mockCustomFields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || field.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Data Management</h1>
            <p className="text-gray-600">Import, manage, and analyze custom asset data from various sources</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleImportData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import Data</span>
            </button>
            <button 
              onClick={handleCreateField}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Field</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.csvRecords}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">CSV Records</h3>
          <p className="text-sm text-gray-600">Imported data points</p>
          <div className="mt-2 text-xs text-green-600">+156 this week</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.customFields}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Custom Fields</h3>
          <p className="text-sm text-gray-600">Additional attributes</p>
          <div className="mt-2 text-xs text-blue-600">5 recently added</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link2 className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.apiConnections}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">API Connections</h3>
          <p className="text-sm text-gray-600">External data sources</p>
          <div className="mt-2 text-xs text-green-600">All active</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">{summaryData.lastSync}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Last Sync</h3>
          <p className="text-sm text-gray-600">Data refresh time</p>
          <div className="mt-2 text-xs text-green-600">Auto-sync enabled</div>
        </div>
      </div>

      {/* Data Management Tabs */}
      <div className="bg-white rounded-xl shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button 
              onClick={() => setActiveTab('fields')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fields' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Custom Fields
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Import History
            </button>
            <button 
              onClick={() => setActiveTab('sources')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sources' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Data Sources
            </button>
            <button 
              onClick={() => setActiveTab('validation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'validation' 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Validation Rules
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'fields' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search custom fields..."
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
                    <option value="all">All Types</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                    <option value="select">Select</option>
                    <option value="multiselect">Multi-Select</option>
                  </select>
                </div>
              </div>

              {/* Custom Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFields.map((field) => (
                  <div key={field.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                    <div className="p-6">
                      {/* Field Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Database className="w-6 h-6 text-primary-600" />
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          field.required ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {field.required ? 'Required' : 'Optional'}
                        </span>
                      </div>

                      {/* Field Info */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{field.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{field.description}</p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Type:</span>
                            <span className="font-medium capitalize">{field.type}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Usage:</span>
                            <span className="font-medium">{field.usageCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Created:</span>
                            <span className="font-medium">{field.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Validation */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Validation</h4>
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{field.validation}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditField(field)}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Edit className="w-4 h-4 inline mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteField(field)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredFields.length === 0 && (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No custom fields found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
                  <button 
                    onClick={handleCreateField}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create First Field
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Import History</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockImportHistory.map((importItem) => {
                      const StatusIcon = getImportStatusIcon(importItem.status);
                      return (
                        <div key={importItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <StatusIcon className="w-5 h-5 text-primary-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{importItem.source}</p>
                              <p className="text-xs text-gray-500">{importItem.timestamp}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{importItem.records} records</p>
                              {importItem.errors > 0 && (
                                <p className="text-xs text-red-600">{importItem.errors} errors</p>
                              )}
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImportStatusColor(importItem.status)}`}>
                              {importItem.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDataSources.map((source) => {
                  const TypeIcon = getTypeIcon(source.type);
                  const StatusIcon = getStatusIcon(source.status);
                  return (
                    <div key={source.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="p-6">
                        {/* Source Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <TypeIcon className="w-6 h-6 text-primary-600" />
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(source.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {source.status}
                          </span>
                        </div>

                        {/* Source Info */}
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{source.name}</h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                              <span>Type:</span>
                              <span className="font-medium capitalize">{source.type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Records:</span>
                              <span className="font-medium">{source.recordCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Last Sync:</span>
                              <span className="font-medium">{source.lastSync}</span>
                            </div>
                          </div>
                        </div>

                        {/* Fields */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Fields</h4>
                          <div className="flex flex-wrap gap-1">
                            {source.fields.slice(0, 3).map((field, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {field}
                              </span>
                            ))}
                            {source.fields.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{source.fields.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                            <Settings className="w-4 h-4 inline mr-1" />
                            Configure
                          </button>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Validation Rules</h3>
                </div>
                <div className="p-6 text-center text-gray-500">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>Validation rules configuration will be displayed here</p>
                  <p className="text-sm">Configure data validation and business rules for custom fields</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetsCustomData;

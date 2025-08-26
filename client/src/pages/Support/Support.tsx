import React, { useState } from 'react';
import { 
  Settings, 
  Search, 
  Plus, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Video,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Download,
  Upload,
  Activity,
  Users,
  Globe,
  Shield,
  Zap,
  Filter,
  Eye,
  Edit
} from 'lucide-react';

interface SupportTicket {
  _id: string;
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  category: 'Technical' | 'Billing' | 'Feature Request' | 'Bug Report' | 'General';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  responseTime: string;
}

interface KnowledgeArticle {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  views: number;
  helpful: number;
}

const Support: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Mock data for demonstration
  const mockTickets: SupportTicket[] = [
    {
      _id: '1',
      title: 'Dashboard not loading properly',
      description: 'The main dashboard is showing blank sections and error messages',
      priority: 'High',
      status: 'In Progress',
      category: 'Technical',
      assignedTo: 'John Smith',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      responseTime: '2 hours'
    },
    {
      _id: '2',
      title: 'Integration sync failure',
      description: 'CrowdStrike integration is not syncing data properly',
      priority: 'Critical',
      status: 'Open',
      category: 'Technical',
      assignedTo: 'Sarah Johnson',
      createdAt: '2024-01-15T11:30:00Z',
      updatedAt: '2024-01-15T11:30:00Z',
      responseTime: '1 hour'
    },
    {
      _id: '3',
      title: 'Feature request: Custom dashboards',
      description: 'Would like to create custom dashboard layouts for different teams',
      priority: 'Low',
      status: 'Open',
      category: 'Feature Request',
      assignedTo: 'Product Team',
      createdAt: '2024-01-14T16:00:00Z',
      updatedAt: '2024-01-14T16:00:00Z',
      responseTime: '24 hours'
    },
    {
      _id: '4',
      title: 'Billing inquiry',
      description: 'Question about enterprise pricing and volume discounts',
      priority: 'Medium',
      status: 'Resolved',
      category: 'Billing',
      assignedTo: 'Billing Team',
      createdAt: '2024-01-13T10:00:00Z',
      updatedAt: '2024-01-14T15:00:00Z',
      responseTime: '4 hours'
    }
  ];

  const mockArticles: KnowledgeArticle[] = [
    {
      _id: '1',
      title: 'Getting Started with VulNova',
      category: 'Getting Started',
      tags: ['beginner', 'setup', 'configuration'],
      lastUpdated: '2024-01-10T10:00:00Z',
      views: 1247,
      helpful: 89
    },
    {
      _id: '2',
      title: 'Configuring EDR Integrations',
      category: 'Integrations',
      tags: ['edr', 'crowdstrike', 'sentinelone', 'configuration'],
      lastUpdated: '2024-01-12T14:30:00Z',
      views: 856,
      helpful: 67
    },
    {
      _id: '3',
      title: 'Understanding Risk Scoring',
      category: 'Risk Management',
      tags: ['risk', 'scoring', 'assessment', 'metrics'],
      lastUpdated: '2024-01-08T09:15:00Z',
      views: 2341,
      helpful: 156
    },
    {
      _id: '4',
      title: 'Troubleshooting Common Issues',
      category: 'Troubleshooting',
      tags: ['troubleshooting', 'errors', 'fixes', 'common'],
      lastUpdated: '2024-01-14T11:20:00Z',
      views: 1892,
      helpful: 234
    }
  ];

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical':
        return Settings;
      case 'Billing':
        return FileText;
      case 'Feature Request':
        return Plus;
      case 'Bug Report':
        return AlertTriangle;
      case 'General':
        return HelpCircle;
      default:
        return MessageCircle;
    }
  };

  const ticketCategories = ['all', 'Technical', 'Billing', 'Feature Request', 'Bug Report', 'General'];
  const ticketPriorities = ['all', 'Critical', 'High', 'Medium', 'Low'];

  const summaryData = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === 'Open').length,
    inProgress: mockTickets.filter(t => t.status === 'In Progress').length,
    resolved: mockTickets.filter(t => t.status === 'Resolved').length
  };

  const supportChannels = [
    { name: 'Email Support', icon: Mail, description: 'Get help via email', response: '4 hours', available: true },
    { name: 'Phone Support', icon: Phone, description: 'Speak with our experts', response: 'Immediate', available: true },
    { name: 'Live Chat', icon: MessageCircle, description: 'Real-time chat support', response: '2 minutes', available: true },
    { name: 'Knowledge Base', icon: BookOpen, description: 'Self-service articles', response: 'Instant', available: true }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
            <p className="text-gray-600">Get help, submit tickets, and access knowledge resources</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Base</span>
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {supportChannels.map((channel, index) => {
          const Icon = channel.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-primary-600" />
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  channel.available ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {channel.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{channel.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
              <div className="text-xs text-gray-500">Response: {channel.response}</div>
            </div>
          );
        })}
      </div>

      {/* Ticket Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{summaryData.total}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Tickets</h3>
          <p className="text-sm text-gray-600">All support requests</p>
          <div className="mt-2 text-xs text-blue-600">Tracked</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{summaryData.open}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Open</h3>
          <p className="text-sm text-gray-600">Awaiting response</p>
          <div className="mt-2 text-xs text-blue-600">Needs attention</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">{summaryData.inProgress}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">In Progress</h3>
          <p className="text-sm text-gray-600">Being worked on</p>
          <div className="mt-2 text-xs text-yellow-600">Active</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{summaryData.resolved}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Resolved</h3>
          <p className="text-sm text-gray-600">Completed</p>
          <div className="mt-2 text-xs text-green-600">Success</div>
        </div>
      </div>

      {/* Knowledge Base Highlights */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Popular Knowledge Articles</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All Articles <ExternalLink className="w-4 h-4 inline ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockArticles.map((article) => (
            <div key={article._id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{article.category}</span>
                <span>{article.views} views</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tickets by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              {ticketCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              {ticketPriorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => {
                const CategoryIcon = getCategoryIcon(ticket.category);
                
                return (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <CategoryIcon className="w-4 h-4 text-primary-600" />
                        <span className="text-sm text-gray-900">{ticket.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ticket.assignedTo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Create First Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default Support;

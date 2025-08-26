import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  AlertTriangle, 
  BarChart3, 
  Shield, 
  FileText, 
  Settings, 
  ChevronDown,
  Activity,
  Users,
  Globe,
  Database,
  Network,
  Monitor,
  Plus,
  Scan,
  Link,
  ShieldCheck,
  Building,
  Laptop,
  GitBranch,
  Layers
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const location = useLocation();

  const toggleSubmenu = (submenuId: string) => {
    setOpenSubmenus(prev => 
      prev.includes(submenuId) 
        ? prev.filter(id => id !== submenuId)
        : [...prev, submenuId]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`fixed left-0 top-0 transition-all duration-300 bg-white shadow-lg h-screen flex-shrink-0 flex flex-col z-30 ${collapsed ? 'w-16' : 'w-56'}`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <div className="h-6 w-6 bg-white rounded-md flex items-center justify-center">
              <span className="text-purple-600 font-extrabold text-sm">V</span>
            </div>
          </div>
          {!collapsed && (
            <span className="font-extrabold text-primary-800 text-lg">VulNova</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 overflow-y-auto">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/"
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 rounded transition ${
                isActive('/') ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
          </li>

          {/* Assets Section with Submenu */}
          <li>
            <div
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 rounded transition cursor-pointer ${
                location.pathname.startsWith('/assets') ? 'bg-primary-50 text-primary-700' : ''
              }`}
              onClick={() => toggleSubmenu('assets')}
            >
              <Server className="w-5 h-5 mr-3" />
              {!collapsed && (
                <>
                  <span className="flex-1">Assets</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    openSubmenus.includes('assets') ? 'rotate-180' : ''
                  }`} />
                </>
              )}
            </div>
            {!collapsed && openSubmenus.includes('assets') && (
              <ul className="pl-4 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="/assets"
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 rounded transition ${
                      isActive('/assets') ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Asset Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assets/dashboards"
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 rounded transition ${
                      isActive('/assets/dashboards') ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboards
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assets/graph"
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 rounded transition ${
                      isActive('/assets/graph') ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <Network className="w-4 h-4 mr-2" />
                    Asset Graph
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assets/custom-data"
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 rounded transition ${
                      isActive('/assets/custom-data') ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Custom Data
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assets/edp"
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 rounded transition ${
                      isActive('/assets/edp') ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    EDP Connections
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assets/edr"
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 rounded transition ${
                      isActive('/assets/edr') ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    EDR Connections
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assets/ldap"
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 rounded transition ${
                      isActive('/assets/ldap') ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <Building className="w-4 h-4 mr-2" />
                    LDAP Connections
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assets/integrations"
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 rounded transition ${
                      isActive('/assets/integrations') ? 'bg-primary-50 text-primary-700' : ''
                    }`}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Integrations
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Vulnerabilities */}
          <li>
            <NavLink
              to="/vulnerabilities"
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 rounded transition ${
                isActive('/vulnerabilities') ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              <AlertTriangle className="w-5 h-5 mr-3" />
              {!collapsed && <span>Vulnerabilities</span>}
            </NavLink>
          </li>

          {/* Threat Intelligence */}
          <li>
            <NavLink
              to="/threat-intelligence"
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 rounded transition ${
                isActive('/threat-intelligence') ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              <Shield className="w-5 h-5 mr-3" />
              {!collapsed && <span>Threat Intelligence</span>}
            </NavLink>
          </li>

          {/* Reporting */}
          <li>
            <NavLink
              to="/reporting"
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 rounded transition ${
                isActive('/reporting') ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              {!collapsed && <span>Reporting</span>}
            </NavLink>
          </li>

          {/* Software Inventory */}
          <li>
            <NavLink
              to="/software-inventory"
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 rounded transition ${
                isActive('/software-inventory') ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              {!collapsed && <span>Software Inventory</span>}
            </NavLink>
          </li>

          {/* Integrations */}
          <li>
            <NavLink
              to="/integrations"
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 rounded transition ${
                isActive('/integrations') ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              <Link className="w-5 h-5 mr-3" />
              {!collapsed && <span>Integrations</span>}
            </NavLink>
          </li>

          {/* Support */}
          <li>
            <NavLink
              to="/support"
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 rounded transition ${
                isActive('/support') ? 'bg-primary-50 text-primary-700' : ''
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              {!collapsed && <span>Support</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
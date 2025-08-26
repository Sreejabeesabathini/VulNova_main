import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarCollapsed }) => {
  return (
    <header className="bg-white shadow flex items-center px-6 py-4 fixed top-0 right-0 z-20 transition-all duration-300" style={{ left: sidebarCollapsed ? '4rem' : '14rem' }}>
      <button 
        onClick={onToggleSidebar}
        className="md:hidden mr-4 text-gray-500 focus:outline-none hover:text-gray-700 transition-colors"
      >
        <Menu className="w-7 h-7" />
      </button>
      
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <div className="h-6 w-6 bg-white rounded-md flex items-center justify-center">
            <span className="text-purple-600 font-extrabold text-sm">V</span>
          </div>
        </div>
        <span className="text-2xl font-extrabold text-primary-800">VulNova</span>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Map } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Map className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Traffic Monitoring System
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="#dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="#analytics" className="text-gray-600 hover:text-gray-900">
              Analytics
            </a>
            <a href="#settings" className="text-gray-600 hover:text-gray-900">
              Settings
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
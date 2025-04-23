import React, { useState } from 'react';
import './styles/globals.css';
import TrafficMonitor from './components/dashboard/TrafficMonitor';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import SettingsPage from './components/settings/SettingsPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
      default:
        return <TrafficMonitor />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2 mb-3 sm:mb-0">
              <div className="bg-blue-500 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Traffic Monitoring System
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`text-sm ${currentPage === 'dashboard' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentPage('analytics')}
                className={`text-sm ${currentPage === 'analytics' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Analytics
              </button>
              <button 
                onClick={() => setCurrentPage('settings')}
                className={`text-sm ${currentPage === 'settings' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      <footer className="bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              © 2024 Traffic Monitoring System
            </p>
            <div className="flex items-center space-x-4">
              <a href="#about" className="text-sm text-gray-600 hover:text-gray-900">About</a>
              <a href="#help" className="text-sm text-gray-600 hover:text-gray-900">Help</a>
              <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

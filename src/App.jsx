import React from 'react';
import './styles/globals.css';
import TrafficMonitor from './components/dashboard/TrafficMonitor';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <h1 className="text-xl font-bold text-gray-900">
                Traffic Monitoring System
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="#dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="#analytics" className="text-gray-600 hover:text-gray-900">Analytics</a>
              <a href="#settings" className="text-gray-600 hover:text-gray-900">Settings</a>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <TrafficMonitor />
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
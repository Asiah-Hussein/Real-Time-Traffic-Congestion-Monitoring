import React, { useState } from 'react';
import { Save, Bell, Map, RefreshCw, BarChart, Shield } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Data refresh settings
    refreshInterval: 5,
    enableRealTimeUpdates: true,
    
    // Map settings
    mapStyle: 'standard',
    showTrafficLayer: true,
    defaultLocation: 'city-center',
    
    // Alert settings
    congestionAlertThreshold: 70,
    enableNotifications: true,
    emailAlerts: false,
    emailAddress: '',
    
    // Display settings
    temperatureUnit: 'celsius',
    distanceUnit: 'miles',
    timeFormat: '24h',
    
    // Analytics settings
    dataRetentionPeriod: 30,
    predictionWindowHours: 2
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to a backend or localStorage
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure your traffic monitoring system</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Data Refresh Settings */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-5 w-5 text-blue-500" />
            <h2 className="font-semibold">Data Refresh Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refresh Interval (seconds)
              </label>
              <input
                type="number"
                name="refreshInterval"
                value={settings.refreshInterval}
                onChange={handleChange}
                min="1"
                max="60"
                className="p-2 border rounded w-full"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableRealTimeUpdates"
                name="enableRealTimeUpdates"
                checked={settings.enableRealTimeUpdates}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <label htmlFor="enableRealTimeUpdates" className="text-sm font-medium text-gray-700">
                Enable real-time updates
              </label>
            </div>
          </div>
        </div>

        {/* Map Settings */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Map className="h-5 w-5 text-blue-500" />
            <h2 className="font-semibold">Map Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Map Style
              </label>
              <select
                name="mapStyle"
                value={settings.mapStyle}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
                <option value="dark">Dark Mode</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Location
              </label>
              <select
                name="defaultLocation"
                value={settings.defaultLocation}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="city-center">City Center</option>
                <option value="north-highway">North Highway</option>
                <option value="south-bridge">South Bridge</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTrafficLayer"
                name="showTrafficLayer"
                checked={settings.showTrafficLayer}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <label htmlFor="showTrafficLayer" className="text-sm font-medium text-gray-700">
                Show traffic layer
              </label>
            </div>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="font-semibold">Alert Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Congestion Alert Threshold (%)
              </label>
              <input
                type="number"
                name="congestionAlertThreshold"
                value={settings.congestionAlertThreshold}
                onChange={handleChange}
                min="0"
                max="100"
                className="p-2 border rounded w-full"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableNotifications"
                name="enableNotifications"
                checked={settings.enableNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <label htmlFor="enableNotifications" className="text-sm font-medium text-gray-700">
                Enable browser notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailAlerts"
                name="emailAlerts"
                checked={settings.emailAlerts}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <label htmlFor="emailAlerts" className="text-sm font-medium text-gray-700">
                Email alerts
              </label>
            </div>
            
            {settings.emailAlerts && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={settings.emailAddress}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  placeholder="your@email.com"
                />
              </div>
            )}
          </div>
        </div>

        {/* Analytics Settings */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-5 w-5 text-blue-500" />
            <h2 className="font-semibold">Analytics Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Retention Period (days)
              </label>
              <select
                name="dataRetentionPeriod"
                value={settings.dataRetentionPeriod}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prediction Window (hours)
              </label>
              <select
                name="predictionWindowHours"
                value={settings.predictionWindowHours}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="6">6 hours</option>
                <option value="24">24 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-blue-500" />
            <h2 className="font-semibold">Display Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature Unit
              </label>
              <select
                name="temperatureUnit"
                value={settings.temperatureUnit}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance Unit
              </label>
              <select
                name="distanceUnit"
                value={settings.distanceUnit}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="miles">Miles</option>
                <option value="kilometers">Kilometers</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Format
              </label>
              <select
                name="timeFormat"
                value={settings.timeFormat}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
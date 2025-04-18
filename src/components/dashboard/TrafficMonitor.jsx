import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Map, AlertTriangle } from 'lucide-react';
import { generateMockData, generateHistoricalData } from '../../services/mockData';
import TrafficMap from './TrafficMap';

const TrafficMonitor = () => {
  const [selectedLocation, setSelectedLocation] = useState('city-center');
  const [trafficData, setTrafficData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize with historical data
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        const histData = generateHistoricalData(selectedLocation);
        setTrafficData(histData);
        setError(null);
      } catch (err) {
        setError('Failed to load historical data');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [selectedLocation]);

  // Set up real-time updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const newData = generateMockData(selectedLocation);
        setTrafficData(prev => [...prev.slice(-11), newData]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch traffic data');
      }
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  // Generate prediction data
  useEffect(() => {
    if (trafficData.length > 0) {
      const lastPoint = trafficData[trafficData.length - 1];
      const predictions = Array.from({ length: 12 }, (_, i) => {
        const time = new Date();
        time.setMinutes(time.getMinutes() + (i + 1) * 5);
        
        return {
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          predictedCongestion: Math.max(0, Math.min(100, 
            lastPoint.congestionLevel + (Math.random() * 6 - 3) * (i + 1))),
          predictedSpeed: Math.max(10, 
            lastPoint.averageSpeed + (Math.random() * 4 - 2) * (i + 1))
        };
      });
      setPredictionData(predictions);
    }
  }, [trafficData]);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const latestData = trafficData.length > 0 ? trafficData[trafficData.length - 1] : null;

  // Helper function to determine congestion status and color
  const getCongestionStatus = (level) => {
    if (level < 50) return { status: 'Low', color: 'text-green-500' };
    if (level < 70) return { status: 'Moderate', color: 'text-yellow-500' };
    return { status: 'High', color: 'text-red-500' };
  };

  // Extract status and color for the latest data
  const { status, color } = getCongestionStatus(latestData?.congestionLevel || 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Traffic Congestion Monitor</h1>
        <p className="text-gray-600">Real-time analysis with predictive modeling</p>
      </div>

      <div className="mb-6">
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          className="p-2 border rounded w-48"
        >
          <option value="city-center">City Center</option>
          <option value="north-highway">North Highway</option>
          <option value="south-bridge">South Bridge</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <div>
            <h5 className="font-medium">Error</h5>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-5 w-5" />
            <h2 className="font-semibold">Current Congestion</h2>
          </div>
          <p className={`text-2xl font-bold ${color}`}>{status}</p>
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `${latestData?.congestionLevel?.toFixed(1)}% congested`}
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5" />
            <h2 className="font-semibold">Average Speed</h2>
          </div>
          <p className="text-2xl font-bold">
            {loading ? 'Loading...' : `${latestData?.averageSpeed?.toFixed(1)} mph`}
          </p>
          <p className="text-sm text-gray-600">Current traffic speed</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Map className="h-5 w-5" />
            <h2 className="font-semibold">Vehicle Count</h2>
          </div>
          <p className="text-2xl font-bold">
            {loading ? 'Loading...' : latestData?.totalVehicles}
          </p>
          <p className="text-sm text-gray-600">Active vehicles</p>
        </div>
      </div>
      
      {/* Traffic Map */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Live Traffic Map</h2>
        <TrafficMap location={selectedLocation} />
      </div>

      {/* Traffic Trends Chart */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Traffic Trends</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData.map(item => ({
                time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                congestion: item.congestionLevel,
                speed: item.averageSpeed
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="congestion" 
                  stroke="#8884d8" 
                  name="Congestion Level" 
                  dot={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#82ca9d" 
                  name="Average Speed" 
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Traffic Prediction Chart */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Traffic Prediction</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="predictedCongestion" 
                  stroke="#ff7300" 
                  name="Predicted Congestion" 
                  strokeDasharray="5 5"
                  dot={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="predictedSpeed" 
                  stroke="#82ca9d" 
                  name="Predicted Speed" 
                  strokeDasharray="5 5"
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficMonitor;
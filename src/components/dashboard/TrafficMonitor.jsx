/**
 * @component TrafficMonitor
 * @description Main dashboard component that displays real-time traffic monitoring data.
 * It fetches and displays traffic data, renders status cards, traffic maps, and data charts.
 * 
 * @prop {string} [initialLocation='city-center'] - The initial location to display
 * @returns {JSX.Element} The rendered traffic monitoring dashboard
 * 
 * @example
 * <TrafficMonitor initialLocation="north-highway" />
 */

import React, { useState, useEffect } from 'react';
import { generateMockData, generateHistoricalData } from '../../services/mockData';
import StatusCards from './StatusCards';
import TrafficMap from './TrafficMap';
import { Alert, AlertTitle, AlertDescription } from '../ui/Alert';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const TrafficMonitor = () => {
  const [selectedLocation, setSelectedLocation] = useState('city-center');
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState([]);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newData = generateMockData(selectedLocation);
        setTrafficData(prev => [...prev.slice(-11), newData]);

        // Simulate predicted data here
        const simulatedPredictions = trafficData.map((entry, idx) => ({
          time: new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          predictedCongestion: Math.min(100, entry.congestionLevel + Math.random() * 10),
          predictedSpeed: Math.max(10, entry.averageSpeed + Math.random() * 5),
        }));
        setPredictionData(simulatedPredictions);

        setError(null);
      } catch (err) {
        setError('Failed to fetch traffic data');
      }
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedLocation, trafficData]);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const latestData = trafficData.length > 0 ? trafficData[trafficData.length - 1] : null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Traffic Congestion Monitor</h1>
        <p className="text-gray-600">Real-time analysis with predictive modeling</p>
      </div>

      <div className="mb-6">
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          className="p-2 border rounded w-full md:w-48"
        >
          <option value="city-center">City Center</option>
          <option value="north-highway">North Highway</option>
          <option value="south-bridge">South Bridge</option>
        </select>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <StatusCards data={latestData} loading={loading} />

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Live Traffic Map</h2>
        <TrafficMap location={selectedLocation} />
      </div>

      {/* Updated Traffic Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Traffic Trends</h2>
          <div className="bg-white p-4 rounded-lg shadow h-full">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData.map(item => ({
                  time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  congestion: item.congestionLevel,
                  speed: item.averageSpeed,
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

        <div>
          <h2 className="text-lg font-semibold mb-4">Traffic Prediction</h2>
          <div className="bg-white p-4 rounded-lg shadow h-full">
            <div className="mb-4 flex space-x-4">
              <div className="p-2 bg-blue-50 rounded">
                <p className="text-xs text-gray-500">Congestion Prediction Accuracy</p>
                <p className="text-lg font-semibold">93%</p>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <p className="text-xs text-gray-500">Speed Prediction Accuracy</p>
                <p className="text-lg font-semibold">98%</p>
              </div>
            </div>
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
    </div>
  );
};

export default TrafficMonitor;

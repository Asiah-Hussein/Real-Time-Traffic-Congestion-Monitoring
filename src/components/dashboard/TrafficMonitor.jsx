import React, { useState, useEffect } from 'react';
import { Activity, Clock, Map, AlertTriangle } from 'lucide-react';
import { generateMockData, generateHistoricalData } from '../../services/mockData';
import StatusCards from './StatusCards';
import CongestionChart from './CongestionChart';
import PredictionChart from './PredictionChart';
import TrafficMap from './TrafficMap';
import { Alert, AlertTitle, AlertDescription } from '../ui/Alert';
import Select from '../ui/Select';

const TrafficMonitor = () => {
  const [selectedLocation, setSelectedLocation] = useState('city-center');
  const [trafficData, setTrafficData] = useState([]);
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

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const latestData = trafficData.length > 0 ? trafficData[trafficData.length - 1] : null;

  const locationOptions = [
    { value: 'city-center', label: 'City Center' },
    { value: 'north-highway', label: 'North Highway' },
    { value: 'south-bridge', label: 'South Bridge' }
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Traffic Congestion Monitor</h1>
        <p className="text-gray-600">Real-time analysis with predictive modeling</p>
      </div>

      <div className="mb-6">
        <Select
          options={locationOptions}
          value={selectedLocation}
          onChange={handleLocationChange}
          placeholder="Select location"
          className="w-full md:w-48"
        />
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Status Cards */}
      <StatusCards data={latestData} loading={loading} />
      
      {/* Traffic Map */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Live Traffic Map</h2>
        <TrafficMap location={selectedLocation} />
      </div>

      {/* Traffic Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Traffic Trends</h2>
          <CongestionChart data={trafficData} />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Traffic Prediction</h2>
          <PredictionChart data={trafficData} locationId={selectedLocation} />
        </div>
      </div>
    </div>
  );
};

export default TrafficMonitor;
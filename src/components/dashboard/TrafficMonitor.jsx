import React, { useState } from 'react';
import CongestionChart from './CongestionChart';
import PredictionChart from './PredictionChart';
import StatusCards from './StatusCards';
import TrafficMap from './TrafficMap';
import { useTrafficData } from '../../hooks/useTrafficData';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { AlertTriangle } from 'lucide-react';

const TrafficMonitor = () => {
  const [selectedLocation, setSelectedLocation] = useState('city-center');
  const { trafficData, loading, error } = useTrafficData(selectedLocation);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Traffic Congestion Monitor</h1>
        <p className="text-gray-600">Real-time analysis with predictive modeling</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <StatusCards data={trafficData[trafficData.length - 1]} loading={loading} />
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Live Traffic Map</h2>
        <TrafficMap location={selectedLocation} />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Traffic Trends</h2>
        <CongestionChart data={trafficData} />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Traffic Prediction</h2>
        <PredictionChart data={trafficData} />
      </div>
    </div>
  );
};

export default TrafficMonitor;
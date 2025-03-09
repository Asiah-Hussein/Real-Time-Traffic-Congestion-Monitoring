import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDateTime } from '../../utils/helpers';

const PredictionChart = ({ data }) => {
  // Generate prediction data based on current trends
  const generatePredictions = () => {
    if (!data || data.length < 2) return [];
    
    const lastPoint = data[data.length - 1];
    const trend = calculateTrend(data);
    
    return Array.from({ length: 6 }, (_, i) => {
      const time = new Date(lastPoint.timestamp);
      time.setMinutes(time.getMinutes() + (i + 1) * 15);
      
      return {
        timestamp: time.toISOString(),
        predictedCongestion: Math.max(0, Math.min(100, 
          lastPoint.congestionLevel + trend.congestion * (i + 1))),
        predictedSpeed: Math.max(0, 
          lastPoint.averageSpeed + trend.speed * (i + 1))
      };
    });
  };

  const calculateTrend = (data) => {
    const n = data.length;
    if (n < 2) return { congestion: 0, speed: 0 };
    
    return {
      congestion: (data[n-1].congestionLevel - data[n-2].congestionLevel) / 2,
      speed: (data[n-1].averageSpeed - data[n-2].averageSpeed) / 2
    };
  };

  const predictions = generatePredictions();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDateTime}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(timestamp) => formatDateTime(timestamp)}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="predictedCongestion" 
              stroke="#ff7300" 
              name="Predicted Congestion" 
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="predictedSpeed" 
              stroke="#82ca9d" 
              name="Predicted Speed" 
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionChart;
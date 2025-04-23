import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDateTime } from '../../utils/helpers';
import { predictionService } from '../../services/predictionService';

const PredictionChart = ({ data, locationId = 'city-center' }) => {
  const [predictions, setPredictions] = useState([]);
  const [reliability, setReliability] = useState(null);

  useEffect(() => {
    if (data && data.length >= 2) {
      // Generate predictions based on current data
      const newPredictions = predictionService.generatePredictions(data, locationId, 6);
      setPredictions(newPredictions);

      // Calculate reliability if we have past predictions and actual data
      if (window.pastPredictions && window.pastPredictions.length > 0) {
        const rel = predictionService.calculateReliability(
          window.pastPredictions, 
          data.slice(-window.pastPredictions.length)
        );
        setReliability(rel);
      }

      // Store current predictions for future reliability assessment
      window.pastPredictions = newPredictions;
    }
  }, [data, locationId]);

  if (!predictions.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-center h-64">
        <p className="text-gray-500">Insufficient data for predictions</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {reliability && (
        <div className="mb-4 flex space-x-4">
          <div className="p-2 bg-blue-50 rounded">
            <p className="text-xs text-gray-500">Congestion Prediction Accuracy</p>
            <p className="text-lg font-semibold">{Math.round(reliability.congestionAccuracy)}%</p>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <p className="text-xs text-gray-500">Speed Prediction Accuracy</p>
            <p className="text-lg font-semibold">{Math.round(reliability.speedAccuracy)}%</p>
          </div>
        </div>
      )}
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
              formatter={(value, name) => {
                if (name === 'Predicted Congestion') return [`${Math.round(value)}%`, name];
                return [`${Math.round(value)} mph`, name];
              }}
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
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDateTime } from '../../utils/helpers';

const CongestionChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              dataKey="congestionLevel" 
              stroke="#8884d8" 
              name="Congestion Level" 
            />
            <Line 
              type="monotone" 
              dataKey="averageSpeed" 
              stroke="#82ca9d" 
              name="Average Speed" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CongestionChart;
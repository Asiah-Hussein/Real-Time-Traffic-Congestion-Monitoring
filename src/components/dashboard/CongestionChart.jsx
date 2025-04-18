import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CongestionChart = ({ data }) => {
  // Create simple dummy data if no data is provided
  const chartData = data && data.length > 0 ? data.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    congestion: item.congestionLevel,
    speed: item.averageSpeed
  })) : [
    { time: '12:00', congestion: 30, speed: 45 },
    { time: '12:05', congestion: 40, speed: 40 },
    { time: '12:10', congestion: 55, speed: 35 },
    { time: '12:15', congestion: 70, speed: 30 },
    { time: '12:20', congestion: 60, speed: 32 }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
            />
            <Line 
              type="monotone" 
              dataKey="speed" 
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
import React from 'react';
import { Map, Activity, Clock } from 'lucide-react';
import { getCongestionStatus } from '../../utils/helpers';

const StatusCards = ({ data, loading }) => {
  const { status, color } = getCongestionStatus(data?.congestionLevel || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5" />
          <h2 className="font-semibold">Current Congestion</h2>
        </div>
        <p className={`text-2xl font-bold ${color}`}>{status}</p>
        <p className="text-sm text-gray-600">
          {loading ? 'Loading...' : `${data?.congestionLevel?.toFixed(1)}% congested`}
        </p>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5" />
          <h2 className="font-semibold">Average Speed</h2>
        </div>
        <p className="text-2xl font-bold">
          {loading ? 'Loading...' : `${data?.averageSpeed?.toFixed(1)} mph`}
        </p>
        <p className="text-sm text-gray-600">Current traffic speed</p>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <Map className="h-5 w-5" />
          <h2 className="font-semibold">Vehicle Count</h2>
        </div>
        <p className="text-2xl font-bold">
          {loading ? 'Loading...' : data?.totalVehicles}
        </p>
        <p className="text-sm text-gray-600">Active vehicles</p>
      </div>
    </div>
  );
};

export default StatusCards;
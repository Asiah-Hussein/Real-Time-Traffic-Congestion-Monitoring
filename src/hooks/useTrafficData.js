import { useState, useEffect, useCallback } from 'react';
import { trafficService } from '../services/trafficService';
import { UPDATE_INTERVAL, HISTORICAL_DATA_POINTS } from '../utils/constants';

export const useTrafficData = (locationId) => {
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrafficData = useCallback(async () => {
    try {
      setLoading(true);
      const newData = await trafficService.getCurrentTrafficData(locationId);
      
      setTrafficData(prev => {
        if (prev.length === 0) {
          // Initialize with historical data
          return trafficService.getHistoricalData(locationId);
        }
        return [...prev.slice(-HISTORICAL_DATA_POINTS + 1), newData];
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch traffic data');
      console.error('Traffic data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, UPDATE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [fetchTrafficData]);

  return { trafficData, loading, error };
};
import { useState, useEffect, useCallback } from 'react';
import { trafficService } from '../services/trafficService';
import { UPDATE_INTERVAL, HISTORICAL_DATA_POINTS } from '../utils/constants';

export const useTrafficData = (locationId) => {
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data with historical data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const histData = await trafficService.getHistoricalData(locationId);
        setTrafficData(histData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical data');
        console.error('Historical data fetch error:', err);
        // Provide fallback data
        setTrafficData([{
          timestamp: new Date().toISOString(),
          locationId,
          averageSpeed: 30,
          totalVehicles: 250,
          congestionLevel: 50
        }]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [locationId]);

  const fetchTrafficData = useCallback(async () => {
    try {
      const newData = await trafficService.getCurrentTrafficData(locationId);
      
      setTrafficData(prev => {
        // Making sure i have data to work with
        if (!prev || prev.length === 0) {
          return [newData];
        }
        return [...prev.slice(-HISTORICAL_DATA_POINTS + 1), newData];
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch traffic data');
      console.error('Traffic data fetch error:', err);
      // Don't change existing data on error
    }
  }, [locationId]);

  // Set up the interval for real-time updates
  useEffect(() => {
    // Only start the interval once we have initial data
    if (trafficData.length > 0) {
      const interval = setInterval(fetchTrafficData, UPDATE_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [fetchTrafficData, trafficData.length]);

  return { 
    trafficData: trafficData || [], 
    loading, 
    error 
  };
};


const calculateTrend = (data, field) => {
  if (!data || data.length < 2) return 0;
  const recentData = data.slice(-5); // Use last 5 data points
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  const n = recentData.length;

  recentData.forEach((point, i) => {
    sumX += i;
    sumY += point[field];
    sumXY += i * point[field];
    sumX2 += i * i;
  });

  // Calculate linear regression slope
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
};

// Add time-of-day weighting
const getTimeBasedFactor = (timestamp, locationId) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Weekend pattern
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend hours (simplified)
    return {
      // Early morning
      0: 0.4, 1: 0.3, 2: 0.2, 3: 0.1, 4: 0.1, 5: 0.2,
      // Morning
      6: 0.3, 7: 0.4, 8: 0.6, 9: 0.8,
      // Midday
      10: 1.0, 11: 1.2, 12: 1.4, 13: 1.5, 14: 1.4, 15: 1.3,
      // Evening
      16: 1.2, 17: 1.1, 18: 1.0, 19: 0.9, 
      // Night
      20: 0.8, 21: 0.7, 22: 0.6, 23: 0.5
    }[hour] || 1;
  }
  
  // Weekday pattern
  return {
    // Early morning
    0: 0.2, 1: 0.1, 2: 0.1, 3: 0.1, 4: 0.2, 5: 0.5,
    // Morning rush
    6: 1.2, 7: 1.5, 8: 1.8, 9: 1.4,
    // Midday
    10: 1.0, 11: 0.9, 12: 1.0, 13: 1.0, 14: 0.9, 15: 1.1,
    // Evening rush
    16: 1.5, 17: 1.8, 18: 1.6, 19: 1.2,
    // Night
    20: 0.9, 21: 0.7, 22: 0.5, 23: 0.3
  }[hour] || 1;
};

export const predictionService = {
  generatePredictions(historicalData, locationId, timeframes = 6) {
    if (!historicalData || historicalData.length < 2) {
      return [];
    }

    const congestionTrend = calculateTrend(historicalData, 'congestionLevel');
    const speedTrend = calculateTrend(historicalData, 'averageSpeed');
    const lastPoint = historicalData[historicalData.length - 1];

    return Array.from({ length: timeframes }, (_, i) => {
      const predictionTime = new Date(lastPoint.timestamp);
      predictionTime.setMinutes(predictionTime.getMinutes() + (i + 1) * 15);
      
      // Apply time-of-day factors
      const timeFactor = getTimeBasedFactor(predictionTime, locationId);
      
      // Apply trend with some randomness and time weighting
      const randomFactor = 0.9 + Math.random() * 0.2; // 90-110% of trend
      const timeWeight = 1 - (i * 0.1); // Confidence decreases with time
      
      // Calculate predicted values
      const predictedCongestion = Math.max(0, Math.min(100,
        lastPoint.congestionLevel + 
        congestionTrend * (i + 1) * randomFactor * timeFactor * timeWeight
      ));
      
      const predictedSpeed = Math.max(10,
        lastPoint.averageSpeed + 
        speedTrend * (i + 1) * randomFactor * (1 / timeFactor) * timeWeight
      );
      
      return {
        timestamp: predictionTime.toISOString(),
        predictedCongestion,
        predictedSpeed,
        confidence: Math.max(60, 100 - (i * 8)) // Confidence decreases with time
      };
    });
  },

  calculateReliability(predictions, actuals) {
    if (!predictions || !actuals || !predictions.length || !actuals.length) {
      return null;
    }

    const errors = predictions.map((pred, i) => {
      const actual = actuals[i];
      if (!actual) return null;
      
      return {
        congestionError: Math.abs(pred.predictedCongestion - actual.congestionLevel),
        speedError: Math.abs(pred.predictedSpeed - actual.averageSpeed)
      };
    }).filter(Boolean);

    if (!errors.length) return null;

    const avgErrors = errors.reduce((acc, curr) => ({
      congestion: acc.congestion + curr.congestionError,
      speed: acc.speed + curr.speedError
    }), { congestion: 0, speed: 0 });

    return {
      congestionAccuracy: 100 - (avgErrors.congestion / errors.length),
      speedAccuracy: 100 - (avgErrors.speed / errors.length)
    };
  }
};
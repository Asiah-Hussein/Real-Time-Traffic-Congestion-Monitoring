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
  
  export const predictionService = {
    generatePredictions(historicalData, timeframes = 6) {
      if (!historicalData || historicalData.length < 2) {
        return [];
      }
  
      const congestionTrend = calculateTrend(historicalData, 'congestionLevel');
      const speedTrend = calculateTrend(historicalData, 'averageSpeed');
      const lastPoint = historicalData[historicalData.length - 1];
  
      return Array.from({ length: timeframes }, (_, i) => {
        const predictionTime = new Date(lastPoint.timestamp);
        predictionTime.setMinutes(predictionTime.getMinutes() + (i + 1) * 15);
  
        // Apply trend with some randomness
        const randomFactor = 0.9 + Math.random() * 0.2; // 90-110% of trend
        
        return {
          timestamp: predictionTime.toISOString(),
          predictedCongestion: Math.max(0, Math.min(100,
            lastPoint.congestionLevel + congestionTrend * (i + 1) * randomFactor
          )),
          predictedSpeed: Math.max(0,
            lastPoint.averageSpeed + speedTrend * (i + 1) * randomFactor
          ),
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
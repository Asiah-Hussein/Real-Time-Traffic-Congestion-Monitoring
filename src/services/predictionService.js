// src/services/predictionService.js

import { TRAFFIC_PATTERNS } from '../utils/constants';

// Machine learning model coefficients
const ML_COEFFICIENTS = {
  intercept: 0.5,
  congestionTrend: 2.3,
  speedTrend: -0.7,
  timeOfDay: 1.2,
  dayOfWeek: 0.8,
  weather: 1.5,
  seasonality: 0.6
};

const WEATHER_IMPACT = {
  clear: 1.0,        // No impact
  cloudy: 1.05,     // Minimal impact
  rain: 1.3,       // Moderate impact
  snow: 1.8,      // Significant impact
  fog: 1.4,      // Moderate impact
  storm: 1.9    // Severe impact
};

const SEASONALITY = {
  1: 1.2, 2: 1.15, 3: 1.1, 4: 1.05, 5: 1.0, 6: 1.05,
  7: 1.1, 8: 1.05, 9: 1.1, 10: 1.15, 11: 1.2, 12: 1.25
};

const calculateTrend = (data, field) => {
  if (!data || data.length < 2) return 0;
  const recentData = data.slice(-5);
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  const n = recentData.length;

  recentData.forEach((point, i) => {
    sumX += i;
    sumY += point[field];
    sumXY += i * point[field];
    sumX2 += i * i;
  });

  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
};

// Updated time-of-day factor function (overrides TRAFFIC_PATTERNS)
const getTimeBasedFactor = (timestamp) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const dayOfWeek = date.getDay();

  const weekendPattern = {
    0: 0.4, 1: 0.3, 2: 0.2, 3: 0.1, 4: 0.1, 5: 0.2,
    6: 0.3, 7: 0.4, 8: 0.6, 9: 0.8, 10: 1.0, 11: 1.2,
    12: 1.4, 13: 1.5, 14: 1.4, 15: 1.3, 16: 1.2, 17: 1.1,
    18: 1.0, 19: 0.9, 20: 0.8, 21: 0.7, 22: 0.6, 23: 0.5
  };

  const weekdayPattern = {
    0: 0.2, 1: 0.1, 2: 0.1, 3: 0.1, 4: 0.2, 5: 0.5,
    6: 1.2, 7: 1.5, 8: 1.8, 9: 1.4, 10: 1.0, 11: 0.9,
    12: 1.0, 13: 1.0, 14: 0.9, 15: 1.1, 16: 1.5, 17: 1.8,
    18: 1.6, 19: 1.2, 20: 0.9, 21: 0.7, 22: 0.5, 23: 0.3
  };

  return (dayOfWeek === 0 || dayOfWeek === 6)
    ? weekendPattern[hour] || 1
    : weekdayPattern[hour] || 1;
};

const getCurrentWeather = (locationId) => {
  const weatherTypes = ['clear', 'cloudy', 'rain', 'snow', 'fog', 'storm'];
  return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
};

const predictWithML = (historicalData, timeOffset, locationId) => {
  if (!historicalData || historicalData.length < 2) return null;

  const lastPoint = historicalData[historicalData.length - 1];
  const predictionTime = new Date(lastPoint.timestamp);
  predictionTime.setMinutes(predictionTime.getMinutes() + timeOffset * 15);

  const congestionTrend = calculateTrend(historicalData, 'congestionLevel');
  const speedTrend = calculateTrend(historicalData, 'averageSpeed');
  const timeFactor = getTimeBasedFactor(predictionTime);
  const dayFactor = predictionTime.getDay() >= 1 && predictionTime.getDay() <= 5 ? 1.2 : 0.8;
  const weather = getCurrentWeather(locationId);
  const weatherFactor = WEATHER_IMPACT[weather] || 1.0;
  const seasonalityFactor = SEASONALITY[predictionTime.getMonth() + 1] || 1.0;

  const predictedCongestion =
    lastPoint.congestionLevel +
    (ML_COEFFICIENTS.intercept +
      ML_COEFFICIENTS.congestionTrend * congestionTrend * timeOffset +
      ML_COEFFICIENTS.speedTrend * speedTrend * timeOffset +
      ML_COEFFICIENTS.timeOfDay * (timeFactor - 1) * 10 +
      ML_COEFFICIENTS.dayOfWeek * (dayFactor - 1) * 10 +
      ML_COEFFICIENTS.weather * (weatherFactor - 1) * 10 +
      ML_COEFFICIENTS.seasonality * (seasonalityFactor - 1) * 10);

  const boundedCongestion = Math.max(0, Math.min(100, predictedCongestion));
  const speedImpact = (100 - boundedCongestion) / 100;
  const predictedSpeed =
    lastPoint.averageSpeed *
    (1 + (speedTrend * timeOffset * 0.1)) *
    (0.7 + (speedImpact * 0.5));

  const confidence = Math.max(50, 95 - (timeOffset * 5) - ((weatherFactor > 1.2) ? 10 : 0));

  return {
    timestamp: predictionTime.toISOString(),
    predictedCongestion: boundedCongestion,
    predictedSpeed: Math.max(5, predictedSpeed),
    confidence,
    weatherCondition: weather,
    weatherImpact: weatherFactor
  };
};

export const predictionService = {
  generatePredictions(historicalData, locationId, timeframes = 6) {
    if (!historicalData || historicalData.length < 2) return [];

    return Array.from({ length: timeframes }, (_, i) =>
      predictWithML(historicalData, i + 1, locationId)
    );
  },

  calculateReliability(predictions, actuals) {
    if (!predictions?.length || !actuals?.length) return null;

    const errors = predictions.map((pred, i) => {
      const actual = actuals[i];
      if (!actual) return null;

      return {
        congestionError: Math.abs(pred.predictedCongestion - actual.congestionLevel),
        speedError: Math.abs(pred.predictedSpeed - actual.averageSpeed)
      };
    }).filter(Boolean);

    if (!errors.length) return null;

    const total = errors.reduce((acc, curr) => ({
      congestion: acc.congestion + curr.congestionError,
      speed: acc.speed + curr.speedError
    }), { congestion: 0, speed: 0 });

    return {
      congestionAccuracy: 100 - (total.congestion / errors.length),
      speedAccuracy: 100 - (total.speed / errors.length)
    };
  }
};

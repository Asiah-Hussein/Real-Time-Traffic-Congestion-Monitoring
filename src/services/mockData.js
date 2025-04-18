export const generateMockData = (locationId) => {
  const baseConfig = {
    'city-center': { speed: 30, congestion: 65 },
    'north-highway': { speed: 45, congestion: 45 },
    'south-bridge': { speed: 35, congestion: 55 }
  }[locationId] || { speed: 30, congestion: 50 };

  return {
    timestamp: new Date().toISOString(),
    locationId,
    averageSpeed: baseConfig.speed + (Math.random() * 10 - 5),
    totalVehicles: Math.floor(Math.random() * 500) + 200,
    congestionLevel: baseConfig.congestion + (Math.random() * 20 - 10)
  };
};

export const generateHistoricalData = (locationId, count = 12) => {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - (count - i) * 5);
    return {
      ...generateMockData(locationId),
      timestamp: date.toISOString()
    };
  });
};
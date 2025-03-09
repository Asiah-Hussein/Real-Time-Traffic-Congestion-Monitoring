export const generateMockData = (locationId) => {
    const baseSpeed = {
      'city-center': 30,
      'north-highway': 45,
      'south-bridge': 35
    }[locationId] || 30;
  
    const baseCongestion = {
      'city-center': 65,
      'north-highway': 45,
      'south-bridge': 55
    }[locationId] || 50;
  
    return {
      timestamp: new Date().toISOString(),
      locationId,
      averageSpeed: baseSpeed + Math.random() * 10 - 5,
      totalVehicles: Math.floor(Math.random() * 500) + 200,
      congestionLevel: baseCongestion + Math.random() * 20 - 10
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
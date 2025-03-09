export const getCongestionStatus = (level) => {
    if (level < 50) return { status: 'Low', color: 'text-green-500' };
    if (level < 70) return { status: 'Moderate', color: 'text-yellow-500' };
    return { status: 'High', color: 'text-red-500' };
  };
  
  export const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const calculateAverages = (data) => {
    if (!data?.length) return { avgCongestion: 0, avgSpeed: 0 };
    
    const sum = data.reduce((acc, curr) => ({
      congestion: acc.congestion + curr.congestionLevel,
      speed: acc.speed + curr.averageSpeed
    }), { congestion: 0, speed: 0 });
  
    return {
      avgCongestion: sum.congestion / data.length,
      avgSpeed: sum.speed / data.length
    };
  };
  
  export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
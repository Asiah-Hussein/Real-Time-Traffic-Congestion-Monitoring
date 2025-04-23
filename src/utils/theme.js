export const THEME_COLORS = {
    primary: {
      default: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      text: 'text-blue-500',
    },
    success: {
      default: 'bg-green-500',
      hover: 'hover:bg-green-600',
      text: 'text-green-500',
    },
    warning: {
      default: 'bg-yellow-500',
      hover: 'hover:bg-yellow-600',
      text: 'text-yellow-500',
    },
    danger: {
      default: 'bg-red-500',
      hover: 'hover:bg-red-600',
      text: 'text-red-500',
    },
    info: {
      default: 'bg-purple-500',
      hover: 'hover:bg-purple-600',
      text: 'text-purple-500',
    },
    chart: {
      congestion: '#8884d8',
      speed: '#82ca9d',
      prediction: '#ff7300',
    }
  };
  
  export const getCongestionColorClass = (level) => {
    if (level < 40) return 'text-green-500';
    if (level < 60) return 'text-yellow-500';
    if (level < 80) return 'text-orange-500';
    return 'text-red-500';
  };
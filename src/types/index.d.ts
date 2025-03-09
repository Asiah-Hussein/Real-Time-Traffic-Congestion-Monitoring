// Traffic Data Types
export interface TrafficData {
    timestamp: string;
    locationId: string;
    averageSpeed: number;
    totalVehicles: number;
    congestionLevel: number;
  }
  
  // Prediction Types
  export interface PredictionData {
    timestamp: string;
    predictedCongestion: number;
    predictedSpeed: number;
    confidence: number;
  }
  
  // Location Types
  export interface Location {
    id: string;
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }
  
  // Component Props Types
  export interface StatusCardProps {
    data: TrafficData | null;
    loading: boolean;
  }
  
  export interface TrafficMapProps {
    location: string;
    onLocationChange?: (location: string) => void;
  }
  
  export interface CongestionChartProps {
    data: TrafficData[];
  }
  
  export interface PredictionChartProps {
    data: TrafficData[];
  }
  
  // Service Response Types
  export interface TrafficServiceResponse {
    status: 'success' | 'error';
    data?: TrafficData;
    error?: string;
  }
  
  export interface PredictionServiceResponse {
    status: 'success' | 'error';
    predictions?: PredictionData[];
    error?: string;
  }
  
  // UI Component Props
  export interface AlertProps {
    variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
    className?: string;
    children: React.ReactNode;
  }
  
  export interface SelectProps {
    options: Array<{
      value: string;
      label: string;
    }>;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    className?: string;
  }
export const LOCATIONS = {
    'city-center': {
      name: 'City Center',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    'north-highway': {
      name: 'North Highway',
      coordinates: { lat: 51.5504, lng: -0.1277 }
    },
    'south-bridge': {
      name: 'South Bridge',
      coordinates: { lat: 51.4974, lng: -0.1278 }
    }
  };
  
  export const UPDATE_INTERVAL = 5000; // 5 seconds
  export const PREDICTION_INTERVAL = 15000; // 15 seconds
  export const HISTORICAL_DATA_POINTS = 12;
  
  export const CHART_COLORS = {
    congestion: '#8884d8',
    speed: '#82ca9d',
    prediction: '#ff7300'
  };
  
  export const MAP_STYLES = [
    {
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#242f3e" }]
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#746855" }]
    }
  ];
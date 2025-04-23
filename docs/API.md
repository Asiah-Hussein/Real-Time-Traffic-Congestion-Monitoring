# API Documentation

## Google Maps Integration
The system uses the following Google Maps APIs:
- **Maps JavaScript API**: Provides interactive map functionality
- **Roads API**: Retrieves road information and traffic data
- **Traffic Data API**: Retrieves real-time traffic information

### API Key Configuration
1. Create a `.env` file in the project root
2. Add your Google Maps API key:
```
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyCUZf5MaYtnPxACrTb0l8K01cjMzy6pCkM
```

## Available Endpoints

### Traffic Data
- `getCurrentTrafficData(locationId)`
- `getHistoricalData(locationId)`
- `getRealTimeTrafficData(location)`

### Prediction Service
- `generatePredictions(historicalData, timeframes)`
- `calculateReliability(predictions, actuals)`

## Data Structures

### Traffic Data Object
```javascript
{
  timestamp: string,
  locationId: string,
  averageSpeed: number,
  totalVehicles: number,
  congestionLevel: number
}
```

### Prediction Object
```javascript
{
  timestamp: string,
  predictedCongestion: number,
  predictedSpeed: number,
  confidence: number
}
```
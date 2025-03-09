import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrafficMap from '../../src/components/dashboard/TrafficMap';
import { trafficService } from '../../src/services/trafficService';

// Mock the trafficService
jest.mock('../../src/services/trafficService');

describe('TrafficMap Component', () => {
  const mockMap = {
    setCenter: jest.fn(),
    setZoom: jest.fn()
  };

  const mockTrafficLayer = {
    setMap: jest.fn()
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock the Google Maps initialization
    trafficService.initGoogleMaps.mockResolvedValue({
      Map: jest.fn(() => mockMap),
      TrafficLayer: jest.fn(() => mockTrafficLayer)
    });
  });

  test('renders map container', () => {
    render(<TrafficMap location="city-center" />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  test('initializes Google Maps correctly', async () => {
    render(<TrafficMap location="city-center" />);
    
    await waitFor(() => {
      expect(trafficService.initGoogleMaps).toHaveBeenCalled();
    });
  });

  test('updates map center when location changes', async () => {
    const { rerender } = render(<TrafficMap location="city-center" />);
    
    await waitFor(() => {
      expect(trafficService.initGoogleMaps).toHaveBeenCalled();
    });

    rerender(<TrafficMap location="north-highway" />);
    
    expect(mockMap.setCenter).toHaveBeenCalled();
  });

  test('handles map initialization error', async () => {
    // Mock an error during initialization
    trafficService.initGoogleMaps.mockRejectedValue(new Error('Map initialization failed'));
    
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<TrafficMap location="city-center" />);
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Error initializing map:',
        expect.any(Error)
      );
    });
    
    consoleError.mockRestore();
  });

  test('adds traffic layer to map', async () => {
    render(<TrafficMap location="city-center" />);
    
    await waitFor(() => {
      expect(mockTrafficLayer.setMap).toHaveBeenCalledWith(mockMap);
    });
  });
});
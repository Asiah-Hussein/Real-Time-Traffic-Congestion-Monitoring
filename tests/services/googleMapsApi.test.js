import { trafficService } from '../../src/services/trafficService';

// Mock the Google Maps API
const mockGoogleMaps = {
  Map: jest.fn(),
  TrafficLayer: jest.fn(() => ({
    setMap: jest.fn()
  })),
  places: {},
  // Add other necessary Google Maps objects
};

describe('Google Maps API Integration', () => {
  beforeAll(() => {
    // Mock the global google object
    global.google = {
      maps: mockGoogleMaps
    };
    
    // Mock the document.createElement for script loading
    document.createElement = jest.fn(() => ({
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('initializes Google Maps API successfully', async () => {
    const maps = await trafficService.initGoogleMaps();
    expect(maps).toBeDefined();
    expect(maps).toBe(mockGoogleMaps);
  });

  test('handles API loading error', async () => {
    // Simulate script loading error
    document.createElement = jest.fn(() => ({
      setAttribute: jest.fn(),
      addEventListener: jest.fn((event, cb) => {
        if (event === 'error') cb(new Error('Failed to load'));
      }),
      removeEventListener: jest.fn()
    }));

    await expect(trafficService.initGoogleMaps()).rejects.toThrow('Failed to load Google Maps');
  });

  test('fetches traffic data correctly', async () => {
    const mockLocation = { lat: 51.5074, lng: -0.1278 };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ 
        congestion: 'heavy',
        speed: 25
      })
    };

    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    const result = await trafficService.getRealTimeTrafficData(mockLocation);
    
    expect(result).toEqual({
      congestion: 'heavy',
      speed: 25
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('roads.googleapis.com/v1/snapToRoads')
    );
  });

  test('handles traffic data fetch error', async () => {
    const mockLocation = { lat: 51.5074, lng: -0.1278 };
    global.fetch = jest.fn(() => Promise.reject(new Error('API Error')));

    await expect(trafficService.getRealTimeTrafficData(mockLocation))
      .rejects
      .toThrow('API Error');
  });
});
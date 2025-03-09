// Mock fetch
global.fetch = jest.fn();

// Mock Google Maps API
const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementation(success => 
    Promise.resolve(success({
      coords: {
        latitude: 51.5074,
        longitude: -0.1278
      }
    }))
  ),
  watchPosition: jest.fn()
};

global.navigator.geolocation = mockGeolocation;

// Mock script loading
const mockScript = {
  setAttribute: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

document.createElement = tag => {
  if (tag === 'script') return mockScript;
  return document.createElement(tag);
};

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
}

window.IntersectionObserver = IntersectionObserver;

// Clean up
afterEach(() => {
  jest.clearAllMocks();
});
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const trafficService = {
  // Initialize Google Maps API
  async initGoogleMaps() {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(window.google.maps);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve(window.google.maps);
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      
      document.head.appendChild(script);
    });
  },

  // Get traffic data for a specific location
  async getTrafficData(location) {
    try {
      const response = await fetch(
        `https://roads.googleapis.com/v1/snapToRoads?path=${location.lat},${location.lng}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch traffic data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      throw error;
    }
  },

  // Get real-time traffic conditions
  async getTrafficConditions(bounds) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/trafficdata/json?bounds=${bounds}&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch traffic conditions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching traffic conditions:', error);
      throw error;
    }
  }
};
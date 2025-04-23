import React, { useEffect, useRef } from 'react';
import { LOCATIONS } from '../../utils/constants';
import { AlertTriangle } from 'lucide-react';

const TrafficMap = ({ location = 'city-center' }) => {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Function to initialize map
    const initMap = () => {
      try {
        // Get the coordinates for the selected location
        const coordinates = LOCATIONS[location]?.coordinates || { lat: 51.5074, lng: -0.1278 };
        
        // Create map instance
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: coordinates,
          zoom: 13,
          styles: [
            { featureType: "road", elementType: "geometry.fill", stylers: [{ visibility: "on" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ visibility: "on" }] }
          ]
        });
        
        // Add traffic layer
        const trafficLayer = new window.google.maps.TrafficLayer();
        trafficLayer.setMap(mapInstance);
        
        // Add a marker for the selected location
        new window.google.maps.Marker({
          position: coordinates,
          map: mapInstance,
          title: LOCATIONS[location]?.name || 'Selected Location'
        });
        
        setMapError(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      // Create the script element
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      googleMapScript.async = true;
      
      // Set up the callback
      window.initMap = initMap;
      googleMapScript.onload = initMap;
      googleMapScript.onerror = () => {
        console.error('Failed to load Google Maps script');
        setMapError(true);
      };
      
      // Append the script to the DOM
      document.head.appendChild(googleMapScript);
    } else {
      // If API is already loaded, just initialize the map
      initMap();
    }

    // Cleanup
    return () => {
      window.initMap = null;
    };
  }, [location, API_KEY]);

  if (mapError) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Map loading error</h3>
          <p className="text-gray-600">We're unable to load the traffic map at this time. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg" data-testid="map-container">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};

export default TrafficMap;
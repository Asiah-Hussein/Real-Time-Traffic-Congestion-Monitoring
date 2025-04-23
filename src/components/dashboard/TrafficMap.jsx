import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

// Define LOCATIONS directly in the file
const LOCATIONS = {
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

const TrafficMap = ({ location = 'city-center' }) => {
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const API_KEY = 'AIzaSyCUZf5MaYtnPxACrTb0l8K01cjMzy6pCkM'; // Will move to .env later

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
          ],
          gestureHandling: 'cooperative',
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true
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
        
        setMapLoaded(true);
        setMapError(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setMapLoaded(false);
      }
    };

    let scriptElement = null;
    // Load Google Maps API if not already loaded
    if (!window.google) {
      // Create the script element
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      
      // Set up the callback
      window.initMap = initMap;
      googleMapScript.onload = initMap;
      googleMapScript.onerror = () => {
        console.error('Failed to load Google Maps script');
        setMapError(true);
        setMapLoaded(false);
      };
      
      // Append the script to the DOM
      document.head.appendChild(googleMapScript);
      scriptElement = googleMapScript;
    } else {
      // If API is already loaded, just initialize the map
      initMap();
    }

    // Cleanup
    return () => {
      window.initMap = null;
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [location, API_KEY]);

  if (mapError) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Traffic Map</h3>
          <p className="text-gray-600">Map data currently unavailable for this location.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg relative" data-testid="map-container">
      <div ref={mapRef} className="w-full h-full"></div>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default TrafficMap;
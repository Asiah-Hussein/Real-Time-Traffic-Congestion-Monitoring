import React, { useEffect, useRef } from 'react';

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
  const API_KEY = 'AIzaSyCUZf5MaYtnPxACrTb0l8K01cjMzy6pCkM';

  useEffect(() => {
    // Function to initialize map
    const initMap = () => {
      // Get the coordinates for the selected location
      const coordinates = LOCATIONS[location]?.coordinates || { lat: 51.5074, lng: -0.1278 };
      
      // Create map instance
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: 13
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
  }, [location]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};

export default TrafficMap;
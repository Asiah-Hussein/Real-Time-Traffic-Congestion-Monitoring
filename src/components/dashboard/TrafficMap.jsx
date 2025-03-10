import React, { useEffect, useRef, useState } from 'react';
import { trafficService } from '../../services/trafficService';

const TrafficMap = ({ location }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [trafficLayer, setTrafficLayer] = useState(null);

  const locationCoordinates = {
    'city-center': { lat: 51.5074, lng: -0.1278 },
    'north-highway': { lat: 51.5504, lng: -0.1277 },
    'south-bridge': { lat: 51.4974, lng: -0.1278 }
  };

  useEffect(() => {
    const initMap = async () => {
      try {
        const google = await trafficService.initGoogleMaps();
        
        const mapInstance = new google.Map(mapRef.current, {
          center: locationCoordinates[location] || locationCoordinates['city-center'],
          zoom: 13,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }
          ]
        });

        const trafficLayerInstance = new google.TrafficLayer();
        trafficLayerInstance.setMap(mapInstance);

        setMap(mapInstance);
        setTrafficLayer(trafficLayerInstance);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    if (!map) {
      initMap();
    } else {
      map.setCenter(locationCoordinates[location] || locationCoordinates['city-center']);
    }
  }, [location, map]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default TrafficMap;


//i changed here
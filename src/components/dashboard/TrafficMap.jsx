import React, { useEffect, useRef, useState } from 'react';
import { trafficService } from '../../services/trafficService';

const TrafficMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [trafficLayer, setTrafficLayer] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const google = await trafficService.initGoogleMaps();
        
        // Center coordinates (you can adjust these)
        const center = { lat: 51.5074, lng: -0.1278 }; // London coordinates
        
        const mapInstance = new google.Map(mapRef.current, {
          center,
          zoom: 13,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          ],
        });

        // Add traffic layer
        const trafficLayerInstance = new google.TrafficLayer();
        trafficLayerInstance.setMap(mapInstance);

        setMap(mapInstance);
        setTrafficLayer(trafficLayerInstance);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
  }, []);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default TrafficMap;
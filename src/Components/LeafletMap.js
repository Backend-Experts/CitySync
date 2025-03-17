// Might switch to react-map-gl instead of using leaflet
// react-map-gl uses mapbox which may require paying a subscription fee

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import statesData from '../data/us-states.json';

const LeafletMap = () => {
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    // Initialize the map, but without a base tile layer
    mapRef.current = L.map('map', {
      attributionControl: false, // Optional: Remove Leaflet attribution
      zoomControl: false, // Optional: Remove zoom controls
    }).setView([39.8283, -98.5795], 4);

    // Create GeoJSON layer
    geoJsonLayerRef.current = L.geoJSON(statesData, {
      style: {
        fillColor: '#888',
        weight: 1,
        color: '#000',
        fillOpacity: 0.7,
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const stateName = feature.properties.name;
            const popup = L.popup()
              .setLatLng(e.latlng)
              .setContent(`${stateName}`);
            popup.openOn(mapRef.current);
            setPopupContent(stateName);
            layer.setStyle({
              fillColor: '#F53',
              fillOpacity: 1,
            });
          },
          mouseout: (e) => {
            mapRef.current.closePopup();
            setPopupContent(null);
            geoJsonLayerRef.current.resetStyle(e.target);
          },
        });
      },
    }).addTo(mapRef.current);

    // Set map bounds to fit the GeoJSON data
    mapRef.current.fitBounds(geoJsonLayerRef.current.getBounds());

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
      {/*popupContent && <div>Hovered State: {popupContent}</div>*/}
    </div>
  );
};

export default LeafletMap;
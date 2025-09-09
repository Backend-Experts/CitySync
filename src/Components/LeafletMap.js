import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import statesData from '../data/us-states.json';
import cityData from '../data/marker_coords.json';
import { fetchMatchedCities } from './api';
import CityMarkers from './CityMarkers';
import SearchBar from './SearchBar';
import MapControls from './MapControls';
import { useAuth } from 'react-oidc-context';

const LeafletMap = () => {
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const [currentZoom, setCurrentZoom] = useState(6);
  const [activeState, setActiveState] = useState(null);
  const [showCityNames, setShowCityNames] = useState(true);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showMatchedCities, setShowMatchedCities] = useState(true);
  const [matchedCitiesData, setMatchedCitiesData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeLayerRef = useRef(null);
  const auth = useAuth();

  useEffect(() => {
    const fetchUserMatchedCities = async () => {
      setIsLoading(true);
      if (auth.user?.profile?.sub) {
        try {
          const result = await fetchMatchedCities(auth.user.profile.sub);
          if (result?.matched_cities) {
            setMatchedCitiesData(result);
          }
        } catch (error) {
          console.error("Error fetching matched cities:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserMatchedCities();
  }, [auth.user]);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = L.map('map', {
      preferCanvas: true,
      renderer: L.canvas({ padding: 0.5, fadeAnimation: false }),
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      doubleClickZoom: false,
      keepBuffer: 10,
      updateWhenIdle: false,
      updateWhenZooming: false
    }).setView([39.8283, -98.5795], 6);

    mapRef.current.on('zoomend', () => {
      setCurrentZoom(mapRef.current.getZoom());
    });

    const normalStyle = {
      fillColor: '#888',
      weight: 1,
      color: '#000',
      fillOpacity: 0.25,
    };

    const hoverStyle = {
      fillColor: '#F53',
      fillOpacity: 0.25,
    };

    const activeStyle = {
      fillColor: '#F53',
      fillOpacity: 1,
      weight: 2
    };

    geoJsonLayerRef.current = L.geoJSON(statesData, {
      filter: (feature) => !['Puerto Rico'].includes(feature.properties.name),
      style: (feature) => {
        return feature.properties.name === activeState ? activeStyle : normalStyle;
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const bounds = layer.getBounds();
            const center = bounds.getCenter();
            const popup = L.popup({ 
              className: 'custom-state-popup',
              closeButton: false,
              interactive: false
            })
              .setLatLng(center)
              .setContent(`<div class="state-popup-content">${feature.properties.name}</div>`);
            popup.openOn(mapRef.current);
            
            if (feature.properties.name !== activeState) {
              layer.setStyle(hoverStyle);
            }
          },
          mouseout: () => {
            mapRef.current.closePopup();
            if (feature.properties.name !== activeState) {
              layer.setStyle(normalStyle);
            }
          },
          click: () => {
            const stateName = feature.properties.name;
            
            if (activeState === stateName) {
              setActiveState(null);
              setShowCityNames(false);
              geoJsonLayerRef.current.resetStyle(layer);
              activeLayerRef.current = null;
              
              const contiguousStates = geoJsonLayerRef.current.getLayers()
                .filter(l => !['Alaska', 'Hawaii'].includes(l.feature.properties.name));
              mapRef.current.flyToBounds(L.featureGroup(contiguousStates).getBounds(), {
                padding: [50, 50],
                maxZoom: 6,
                animate: true,
                duration: 0.5
              });
            } else {
              setActiveState(stateName);
              setShowCityNames(true);
              if (activeLayerRef.current) {
                geoJsonLayerRef.current.resetStyle(activeLayerRef.current);
              }
              layer.setStyle(activeStyle);
              activeLayerRef.current = layer;
              
              const bounds = layer.getBounds();
              const center = bounds.getCenter();
              mapRef.current.flyTo(center, 6, {
                animate: true,
                duration: 0.5
              });
            }
          }
        });
      }
    }).addTo(mapRef.current);

    const contiguousStates = geoJsonLayerRef.current.getLayers()
      .filter(l => !['Alaska', 'Hawaii'].includes(l.feature.properties.name));
    mapRef.current.fitBounds(L.featureGroup(contiguousStates).getBounds(), {
      padding: [50, 50],
      maxZoom: 6
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .city-label {
        pointer-events: none !important;
      }
      
      .city-label div {
        color: #333;
        font-size: 12px;
        font-weight: bold;
        text-shadow: 
          -1px -1px 0 #fff, 
          1px -1px 0 #fff, 
          -1px 1px 0 #fff, 
          1px 1px 0 #fff;
        white-space: nowrap;
        background-color: rgba(255, 255, 255, 0.3);
        padding: 3px 8px;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        transform: translate(-50%, -100%);
        position: absolute;
        left: 50%;
        top: 0;
        text-align: center;
        transition: all 0.2s ease;
      }

      .city-label:hover div {
        background-color: rgba(255, 255, 255, 0.95);
        z-index: 1000 !important;
        transform: translate(-50%, -100%) scale(1.05);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
      }

      .custom-state-popup {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        pointer-events: none !important;
      }
      
      .custom-state-popup .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.3) !important;
        border-radius: 8px !important;
        box-shadow: none !important;
        padding: 0 !important;
        border: none !important;
        transform: translate(-0%, 150%);
        pointer-events: none !important;
      }
      
      .custom-state-popup .leaflet-popup-tip-container {
        display: none !important;
        pointer-events: none !important;
      }
      
      .state-popup-content {
        margin: 8px 12px;
        color: #000;
        font-weight: bold;
        text-align: center;
        font-size: 14px;
        pointer-events: none !important;
      }

      .search-result-item:hover {
        background-color: #f5f5f5 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div>Loading matched cities...</div>
        </div>
      )}
      <div id="map" style={{ 
        height: '500px', 
        width: '100%',
        backgroundColor: '#fff'
      }} />
      <SearchBar 
        mapRef={mapRef} 
        cityData={cityData} 
        statesData={statesData}
        onStateSelect={setActiveState}
      />
      <MapControls 
        mapRef={mapRef}
        showAllCities={showAllCities}
        setShowAllCities={setShowAllCities}
        setShowCityNames={setShowCityNames}
        activeState={activeState}
        setActiveState={setActiveState} 
        geoJsonLayerRef={geoJsonLayerRef}
        showMatchedCities={showMatchedCities}
        setShowMatchedCities={setShowMatchedCities}
      />
      <CityMarkers 
        mapRef={mapRef} 
        currentZoom={currentZoom} 
        cityData={cityData} 
        activeState={activeState}
        showCityNames={showCityNames}
        showAllCities={showAllCities}
        matchedCities={showMatchedCities ? matchedCitiesData : null}
      />
    </div>
  );
};

export default LeafletMap;
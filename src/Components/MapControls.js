import React, { useEffect, useState } from 'react';
import L from 'leaflet';

const MapControls = ({
  showAllCities,
  setShowAllCities,
  setShowCityNames,
  mapRef,
  activeState,
  setActiveState,
  geoJsonLayerRef,
  showMatchedCities,
  setShowMatchedCities
}) => {
  const [showBaseMap, setShowBaseMap] = useState(false);
  const [showGeoJson, setShowGeoJson] = useState(true);
  const [activeLayerType, setActiveLayerType] = useState(null);

  const baseLayers = [
    {
      name: 'OpenStreetMap',
      type: 'osm',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      activeColor: '#4CAF50',
    },
    {
      name: 'Satellite',
      type: 'satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
      activeColor: '#2196F3',
    },
  ];

  useEffect(() => {
    if (!mapRef.current) return;
    
    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        mapRef.current.removeLayer(layer);
      }
    });
  }, [mapRef]);

  const handleLayerChange = (layerUrl, attribution, layerType) => {
    if (!mapRef.current) return;
    
    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        mapRef.current.removeLayer(layer);
      }
    });

    const layer = L.tileLayer(layerUrl, {
      attribution,
      updateWhenIdle: false,
      updateWhenZooming: false,
      maxZoom: 19,
      minZoom: 3,
    }).addTo(mapRef.current);
    
    setActiveLayerType(layerType);
    setShowBaseMap(true);
  };

  const toggleBaseMap = () => {
    const newState = !showBaseMap;
    setShowBaseMap(newState);
    
    if (activeLayerType) {
      if (newState) {
        const layer = baseLayers.find(l => l.type === activeLayerType);
        handleLayerChange(layer.url, layer.attribution, layer.type);
      } else {
        mapRef.current.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            mapRef.current.removeLayer(layer);
          }
        });
      }
    }
  };

  const toggleGeoJson = () => {
    setShowGeoJson(!showGeoJson);
    if (geoJsonLayerRef.current) {
      if (showGeoJson) {
        mapRef.current.removeLayer(geoJsonLayerRef.current);
      } else {
        geoJsonLayerRef.current.addTo(mapRef.current);
      }
    }
  };

  const handleResetView = () => {
    setActiveState(null);
    setShowCityNames(true);
    if (geoJsonLayerRef.current && mapRef.current) {
      const contiguousStates = geoJsonLayerRef.current.getLayers()
        .filter(l => !['Alaska', 'Hawaii'].includes(l.feature.properties.name));
      mapRef.current.flyToBounds(L.featureGroup(contiguousStates).getBounds(), {
        padding: [50, 50],
        maxZoom: 6,
      });
    }
  };

  const zoomToMatchedCities = () => {
    if (!mapRef.current) return;
    
    const markers = [];
    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        markers.push(layer);
      }
    });
    
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      mapRef.current.fitBounds(group.getBounds(), {
        padding: [50, 50],
        maxZoom: 8
      });
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      minWidth: '220px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '500' }}>Base Map:</span>
        <button
          onClick={toggleBaseMap}
          style={{
            padding: '5px 12px',
            backgroundColor: showBaseMap ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
          }}
        >
          {showBaseMap ? 'ON' : 'OFF'}
        </button>
      </div>

      {showBaseMap && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '-4px' }}>
          {baseLayers.map((layer) => (
            <button
              key={layer.type}
              onClick={() => handleLayerChange(layer.url, layer.attribution, layer.type)}
              style={{
                padding: '6px 8px',
                backgroundColor: activeLayerType === layer.type ? layer.activeColor : '#fff',
                color: activeLayerType === layer.type ? '#fff' : '#333',
                border: `1px solid ${activeLayerType === layer.type ? layer.activeColor : '#ddd'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                flex: 1,
                transition: 'all 0.2s ease',
                fontWeight: activeLayerType === layer.type ? 'bold' : 'normal',
              }}
            >
              {layer.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '500' }}>State Borders:</span>
        <button
          onClick={toggleGeoJson}
          style={{
            padding: '5px 12px',
            backgroundColor: showGeoJson ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
          }}
        >
          {showGeoJson ? 'ON' : 'OFF'}
        </button>
      </div>

      <button 
        onClick={() => {
          const newShowAll = !showAllCities;
          setShowAllCities(newShowAll);
          setShowCityNames(true);
        }}
        style={{
          padding: '8px 12px',
          backgroundColor: showAllCities ? '#FF5722' : '#fff',
          color: showAllCities ? '#fff' : '#333',
          border: `1px solid ${showAllCities ? '#FF5722' : '#ddd'}`,
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          marginTop: '4px',
        }}
      >
        {showAllCities ? 'Hide All Cities' : 'Show All Cities'}
      </button>

      <div style={{ display: 'flex', gap: '6px' }}>
        <button 
          onClick={() => setShowMatchedCities(!showMatchedCities)}
          style={{
            padding: '8px 12px',
            backgroundColor: showMatchedCities ? '#9C27B0' : '#fff',
            color: showMatchedCities ? '#fff' : '#333',
            border: `1px solid ${showMatchedCities ? '#9C27B0' : '#ddd'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            flex: 1
          }}
        >
          {showMatchedCities ? 'Do Not Show Matched Cities' : 'Show Matched Cities'}
        </button>
      </div>

      {activeState && (
        <button
          onClick={handleResetView}
          style={{
            padding: '8px 12px',
            backgroundColor: '#607D8B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
        >
          Reset View
        </button>
      )}
    </div>
  );
};

export default MapControls;
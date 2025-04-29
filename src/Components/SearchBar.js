import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

const SearchBar = ({ mapRef, cityData, statesData, onStateSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  // Handle clicks outside the search bar to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter results based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const matchedStates = statesData.features
      .filter(state => 
        state.properties.name.toLowerCase().includes(term) ||
        state.properties.name.toLowerCase().startsWith(term)
      )
      .map(state => ({
        type: 'state',
        name: state.properties.name,
        feature: state
      }));

    const matchedCities = cityData
      .filter(city => 
        city.name.toLowerCase().includes(term) ||
        city.name.toLowerCase().startsWith(term)
      )
      .map(city => ({
        type: 'city',
        name: city.name,
        state: city.state,
        lat: city.lat,
        lng: city.lng
      }));

    setSearchResults([...matchedStates, ...matchedCities].slice(0, 10));
  }, [searchTerm, cityData, statesData]);

  const handleResultClick = (result) => {
    if (!mapRef.current) return;

    if (result.type === 'state') {
      // Handle state selection
      onStateSelect(result.name);
      const stateLayer = statesData.features.find(f => f.properties.name === result.name);
      if (stateLayer) {
        const bounds = L.geoJSON(stateLayer).getBounds();
        mapRef.current.flyToBounds(bounds, {
          padding: [50, 50],
          animate: true,
          duration: 0.5
        });
      }
    } else {
      // Handle city selection
      mapRef.current.flyTo([result.lat, result.lng], 10, {
        animate: true,
        duration: 0.5
      });
    }

    setSearchTerm('');
    setSearchResults([]);
    setIsFocused(false);
  };

  return (
    <div 
      ref={searchRef}
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        width: '300px'
      }}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Search for a state or city..."
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '14px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      {isFocused && searchResults.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '40px',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1001
        }}>
          {searchResults.map((result, index) => (
            <div
              key={index}
              onClick={() => handleResultClick(result)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                ':hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{result.name}</div>
              {result.type === 'city' && (
                <div style={{ fontSize: '12px', color: '#666' }}>{result.state}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
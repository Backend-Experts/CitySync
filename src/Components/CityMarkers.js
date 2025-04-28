import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
const { MongoClient } = require('mongodb');

const CityMarkers = ({ mapRef, currentZoom, cityData, activeState, showCityNames, showAllCities }) => {
  const markersRef = useRef([]);
  const cityLabelsRef = useRef([]);
  const navigate = useNavigate();

  const getStateAbbreviation = (fullStateName) => {
    const stateAbbreviations = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
      'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
      'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
      'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
      'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
      'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
      'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
      'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
      'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
      'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
      'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
    };
    return stateAbbreviations[fullStateName] || fullStateName;
  };

  const createMarkerIcon = () => {
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  const handleNavigate = useCallback((city) => {
    navigate('/cityinfo', { state: { city: city } });
  }, [navigate]);

  const updateMarkers = () => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    cityLabelsRef.current.forEach(label => mapRef.current.removeLayer(label));
    markersRef.current = [];
    cityLabelsRef.current = [];

    const citiesToDisplay = cityData
      .filter(city => city.lat && city.lng && city.state !== 'Puerto Rico')
      .filter(city => {
        if (showAllCities) return true;
        if (activeState) return city.state === activeState;
        return currentZoom >= city.minZoom;
      });

    citiesToDisplay.forEach(city => {
      const stateAbbr = getStateAbbreviation(city.state);
      const marker = L.marker([city.lat, city.lng], {
        icon: createMarkerIcon(),
        riseOnHover: true
      })
      .bindPopup(
        `<b>${city.name}, ${stateAbbr}</b>
         <div style="margin-top: 8px;">
           <button
             style="
               background-color: #4CAF50;
               color: white;
               border: none;
               padding: 5px 10px;
               text-align: center;
               text-decoration: none;
               display: inline-block;
               font-size: 12px;
               margin: 4px 2px;
               cursor: pointer;
               border-radius: 4px;
             "
             id="city-info-button-${city.name.replace(/\s+/g, '-')}"
           >
             More Info
           </button>
         </div>`
      )
      .on('popupopen', () => {
        // Add click handler after popup is opened
        const button = document.getElementById(`city-info-button-${city.name.replace(/\s+/g, '-')}`);
        if (button) {
          button.addEventListener('click', () => handleNavigate(city));
        }
      })
      .on('popupclose', () => {
        // Clean up event listener when popup closes
        const button = document.getElementById(`city-info-button-${city.name.replace(/\s+/g, '-')}`);
        if (button) {
          button.removeEventListener('click', () => handleNavigate(city));
        }
      })
      .addTo(mapRef.current);

      markersRef.current.push(marker);

      if (showCityNames) {
        const label = L.marker([city.lat, city.lng], {
          icon: L.divIcon({
            className: 'city-label',
            html: `<div>${city.name}</div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 50]
          }),
          zIndexOffset: 1000,
          interactive: false
        }).addTo(mapRef.current);
        cityLabelsRef.current.push(label);
      }
    });
  };

  useEffect(() => {
    updateMarkers();
  }, [currentZoom, cityData, activeState, showAllCities, showCityNames, handleNavigate]);

  return null;
};

export default CityMarkers;
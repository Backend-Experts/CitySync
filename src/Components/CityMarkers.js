import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

const CityMarkers = ({
  mapRef,
  currentZoom,
  cityData,
  activeState,
  showCityNames,
  showAllCities,
  matchedCities
}) => {
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
      'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
      'Virgin Islands': 'VI', 'Puerto Rico': 'PR'
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
    const stateAbbr = getStateAbbreviation(city.state);
    navigate('/cityinfo', {
      state: {
        city: {
          ...city,
          name: city.name,
          state: stateAbbr
        }
      }
    });
  }, [navigate]);

  const updateMarkers = () => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    cityLabelsRef.current.forEach(label => mapRef.current.removeLayer(label));
    markersRef.current = [];
    cityLabelsRef.current = [];

    let citiesToDisplay = [];

    if (matchedCities) {
      const matchedCityKeys = new Set();
      matchedCities.matched_cities.forEach(city => {
        if (city.state !== 'PR') {
          matchedCityKeys.add(`${city.city}_${city.state}`);
        }
      });

      citiesToDisplay = cityData
        .filter(city => city.lat && city.lng)
        .filter(city => {
          const stateAbbr = getStateAbbreviation(city.state);
          return matchedCityKeys.has(`${city.name}_${stateAbbr}`);
        });
    } else {
      citiesToDisplay = cityData
        .filter(city => city.lat && city.lng && city.state !== 'Puerto Rico')
        .filter(city => {
          if (showAllCities) return true;
          if (activeState) return city.state === activeState;
          return currentZoom >= city.minZoom;
        });
    }

    citiesToDisplay.forEach(city => {
      const stateAbbr = getStateAbbreviation(city.state);
      const matchedCity = matchedCities?.matched_cities?.find(
        mc => mc.city === city.name && mc.state === stateAbbr
      );

      //  Correctly extract match percentage, handling potential undefined/null
      const matchPercentage = matchedCity?.match_percentage !== undefined && matchedCity.match_percentage !== null
        ? parseFloat(matchedCity.match_percentage)
        : 0;


      const popupContent = `
        <b>${city.name}, ${stateAbbr}</b>
        ${matchedCity ? `<div>Match Score: ${matchPercentage.toFixed(1)}%</div>` : ''}
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
        </div>
      `;

      const marker = L.marker([city.lat, city.lng], {
        icon: createMarkerIcon(),
        riseOnHover: true
      })
        .bindPopup(popupContent)
        .on('popupopen', () => {
          const button = document.getElementById(`city-info-button-${city.name.replace(/\s+/g, '-')}`);
          if (button) {
            button.addEventListener('click', () => handleNavigate({
              ...city,
              state: stateAbbr
            }));
          }
        })
        .on('popupclose', () => {
          const button = document.getElementById(`city-info-button-${city.name.replace(/\s+/g, '-')}`);
          if (button) {
            button.removeEventListener('click', () => handleNavigate(city));
          }
        })
        .addTo(mapRef.current);

      markersRef.current.push(marker);

      if (showCityNames) {
        const labelText = matchedCity
          ? `${city.name} (${matchPercentage.toFixed(1)}%)`
          : city.name;

        const label = L.marker([city.lat, city.lng], {
          icon: L.divIcon({
            className: 'city-label',
            html: `<div>${labelText}</div>`,
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
    console.log("Matched cities data:", matchedCities); // Debug log
    updateMarkers();
  }, [currentZoom, cityData, activeState, showAllCities, showCityNames, handleNavigate, matchedCities]);

  return null;
};

export default CityMarkers;
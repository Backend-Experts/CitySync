import React, { useCallback } from "react";
import "../CSS/ResultsPage.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const ResultsPage = () => {
  const navigate = useNavigate();
  // Mock data for matched cities
  const matchedCities = [
    {
      name: "St. Louis",
      state: "Missouri",
      lat: 38.6270,
      lng: -90.1994,
      topPreferences: ["Access to Nature", "Walkability", "Affordable Housing", "Education"],
      matchPercentage: 85,
    },
    {
      name: "Boulder",
      state: "Colorado",
      lat: 40.0150,
      lng: -105.2705,
      topPreferences: ["Public Transport", "Racial Diversity", "Restaurant Quality", "Night Life"],
      matchPercentage: 72,
    },
    {
      name: "New York",
      state: "New York",
      lat: 40.7128,
      lng: -74.0060,
      topPreferences: ["Career Opportunities", "Crime Rate", "Weather", "Cost of Living"],
      matchPercentage: 65,
    },
  ];

  const handleNavigate = useCallback((city) => {
    navigate('/cityinfo', { state: { city: city } });
  }, [navigate]); 

  return (
    <div className="results-page-container">
      <h1>Your Matched Cities</h1>
      <div className="cities-grid">
        {matchedCities.map((city, index) => (
          <div key={index} className="city-card">
            {/* Column 1: City Name and Button */}
            <div className="city-info">
              <h2>{city.name}</h2>
              <button 
                className="more-info-button"
                onClick={() => handleNavigate(city)}
              >
                More Information
              </button>
            </div>

            {/* Column 2: Top Preferences */}
            <div className="preferences-box">
              <h3>Top Preferences</h3>
              <ul>
                {city.topPreferences.map((preference, i) => (
                  <li key={i}>{preference}</li>
                ))}
              </ul>
            </div>

            {/* Column 3: Percentage Match and Slider */}
            <div className="match-percentage">
              <h3>Match Percentage</h3>
              <p>{city.matchPercentage}%</p>
              <input
                type="range"
                min="0"
                max="100"
                value={city.matchPercentage}
                disabled // Slider is read-only
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
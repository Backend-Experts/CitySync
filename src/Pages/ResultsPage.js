import React, { useEffect, useCallback, useState } from "react";
import "../CSS/ResultsPage.css";
import { useNavigate } from 'react-router-dom';
import { fetchMatchedCities } from "../Components/api";
import { useAuth } from "react-oidc-context";

const ResultsPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  
  const formatCategoryName = (category) => {
    const formatted = category.replace(/_/g, ' ');
    return formatted.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleNavigate = useCallback((city) => {
    return () => navigate('/cityinfo', { 
      state: { 
        city: {
          ...city,
          name: city.city, 
          state: city.state 
        } 
      } 
    });
  }, [navigate]);

  const [matchCities, setMatchedCities] = useState([]);
  const [error, setError] = useState(null);
  const userId = auth.user?.profile?.sub;
  // const userId = "04b84488-c091-7027-74b3-335aeafecbfa";
  // "04b84488-c091-7027-74b3-335aeafecbfa"

  useEffect(() => {
    const getMatchData = async () => {
      try {
        const result = await fetchMatchedCities(userId);
        if (result?.matched_cities) {
          const formattedCities = result.matched_cities.map(city => ({
            city: city.city.trim(), // City name only
            state: city.state.trim(), // State abbreviation only
            matchPercentage: city.match_percentage ?? 0,
            topCategories: Object.entries(city.category_match || {})
              .map(([category, details]) => ({
                category,
                similarity: details?.similarity ?? 0
              }))
              .sort((a, b) => b.similarity - a.similarity)
              .slice(0, 4)
          }));

          setMatchedCities(formattedCities);
        } else {
          setMatchedCities([]);
        }
      } catch (err) {
        console.error("Error fetching match results:", err);
        setError("Failed to load your matched cities.");
      }
    };

    if (userId) {
      getMatchData();
    }
  }, [userId]);

  return (
    <div className="results-page-container">
      <h1>Your Matched Cities</h1>
      {error && <div className="error-message">{error}</div>}
      
      <div className="cities-grid">
        {matchCities.map((city, index) => (
          <div key={index} className="city-card">
            <div className="city-info">
              {/* Display formatted name here, but pass raw data to navigation */}
              <h2>{city.city}, {city.state}</h2>
              <button 
                className="more-info-button" 
                onClick={handleNavigate(city)}
              >
                More Information
              </button>
            </div>

            <div className="preferences-box">
              <h3>Top Matching Categories</h3>
              <ul>
                {city.topCategories.map((category, i) => (
                  <li key={i}>
                    {formatCategoryName(category.category)}: {(category.similarity > 1 ? category.similarity / 100 : category.similarity).toFixed(1)}%
                  </li>
                ))}
              </ul>
            </div>

            <div className="match-percentage">
              <h3>Match Score</h3>
              <p>{city.matchPercentage.toFixed(1)}%</p>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={city.matchPercentage}
                disabled
                style={{
                  width: "100%",
                  marginTop: "8px",
                  background: `linear-gradient(to right, green 0%, green ${city.matchPercentage}%, #ddd ${city.matchPercentage}%, #ddd 100%)`,
                  height: "6px",
                  borderRadius: "5px",
                  appearance: "none"
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
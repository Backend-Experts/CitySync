
import React, { useEffect, useRef, useCallback, useState } from "react";
import "../CSS/ResultsPage.css";
import { json, useNavigate } from 'react-router-dom';
import { fetchMatchedCities } from "../Components/api";
import { createKeyValueStorageFromCookieStorageAdapter } from "aws-amplify/adapter-core";
import { useAuth } from "react-oidc-context";



const ResultsPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  
  // Process the data to extract and format cities
  const formatCategoryName = (category) => {
    const formatted = category.replace(/_/g, ' ');
    return formatted.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleNavigate = useCallback((city) => {
    navigate('/cityinfo', { state: { city: city } });
  }, [navigate]);

  const [matchCities, setMatchedCities] = useState([]);
  const [error, setError] = useState(null);
  const userId = auth.user?.profile?.sub;

  console.log('Received userId:', userId);

  useEffect(() => {
    const getMatchData = async () => {
      try {
        console.log("Fetching match data for user:", userId);
        const result = await fetchMatchedCities(userId);
        if (result && result.matched_cities) {
          const formattedCities = result.matched_cities.map(city => ({
            name: `${city.city}, ${city.state}`,
            matchPercentage: city.match_percentage ?? 0,
            topCategories: Object.entries(city.category_match || {})
              .map(([category, details]) => ({
                category,
                similarity: details?.similarity ?? 0
              }))
              .sort((a, b) => b.similarity - a.similarity)
              .slice(0, 4)
          }));

          console.log('Formatted cities:', formattedCities);
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
      <div className="cities-grid">
        {matchCities.map((city, index) => (
          <div key={index} className="city-card">
            {/* Column 1: City Name and Button */}
            <div className="city-info">
              <h2>{city.name}</h2>
              <button className="more-info-button" onClick={handleNavigate}>More Information</button>
            </div>

            {/* Column 2: Top Matching Categories */}
            <div className="preferences-box">
              <h3>Top Matching Categories</h3>
              <ul>
                {city.topCategories.map((category, i) => (
                  <li key={i}>
                    {formatCategoryName(category.category)}: {category.similarity.toFixed(1)}%
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Percentage Match and Slider */}
            <div className="match-percentage">
              <h3>Match Score</h3>
              <p>{city.matchPercentage.toFixed(1)}%</p>
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
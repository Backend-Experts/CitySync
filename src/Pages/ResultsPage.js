import React, { useEffect, useRef, useCallback, useState } from "react";
import "../CSS/ResultsPage.css";
import { json, useNavigate } from 'react-router-dom';
import { fetchMatchedCities } from "../Components/api";


const ResultsPage = () => {
  // JSON data included directly in the component
  /*const data = {
    "_id": { "$oid": "68110c55643ff801d3eaa011" },
    "user_id": "c4a84428-c0d1-70a3-92a9-1dfa4fcbfe7b",
    "matched_cities": [
      {
        "city": "New York",
        "state": "NY",
        "match_percentage": { "$numberDouble": "83.62" },
        "category_match": {
          "population": {
            "raw_diff": { "$numberDouble": "0.34" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.34" },
            "similarity": { "$numberDouble": "66.0" }
          },
          "density": {
            "raw_diff": { "$numberDouble": "0.2081" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.2081" },
            "similarity": { "$numberDouble": "79.19" }
          },
          "ranking": {
            "raw_diff": { "$numberDouble": "0.63" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.63" },
            "similarity": { "$numberDouble": "37.0" }
          },
          "cost_of_living_index": {
            "raw_diff": { "$numberDouble": "0.2932" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.2932" },
            "similarity": { "$numberDouble": "70.68" }
          },
          "crime": {
            "raw_diff": { "$numberDouble": "0.1022" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.1022" },
            "similarity": { "$numberDouble": "89.78" }
          },
          "annual_avg_temp": {
            "raw_diff": { "$numberDouble": "0.0903" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0903" },
            "similarity": { "$numberDouble": "90.97" }
          },
          "rent_0_bedroom": {
            "raw_diff": { "$numberDouble": "0.0423" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0423" },
            "similarity": { "$numberDouble": "95.77" }
          },
          "rent_2_bedroom": {
            "raw_diff": { "$numberDouble": "0.0494" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0494" },
            "similarity": { "$numberDouble": "95.06" }
          },
          "rent_1_bedroom": {
            "raw_diff": { "$numberDouble": "0.1806" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.1806" },
            "similarity": { "$numberDouble": "81.94" }
          },
          "rent_3_bedroom": {
            "raw_diff": { "$numberDouble": "0.0528" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0528" },
            "similarity": { "$numberDouble": "94.72" }
          },
          "rent_4_bedroom": {
            "raw_diff": { "$numberDouble": "0.0595" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0595" },
            "similarity": { "$numberDouble": "94.05" }
          },
          "avg_rent": {
            "raw_diff": { "$numberDouble": "0.0612" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0612" },
            "similarity": { "$numberDouble": "93.88" }
          },
          "Education": {
            "raw_diff": { "$numberDouble": "0.0196" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0196" },
            "similarity": { "$numberDouble": "98.04" }
          }
        }
      },
      {
        "city": "Los Angeles",
        "state": "CA",
        "match_percentage": { "$numberDouble": "82.71" },
        "category_match": {
          "population": {
            "raw_diff": { "$numberDouble": "0.0289" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0289" },
            "similarity": { "$numberDouble": "97.11" }
          },
          "density": {
            "raw_diff": { "$numberDouble": "0.4795" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.4795" },
            "similarity": { "$numberDouble": "52.05" }
          },
          "ranking": {
            "raw_diff": { "$numberDouble": "0.63" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.63" },
            "similarity": { "$numberDouble": "37.0" }
          },
          "cost_of_living_index": {
            "raw_diff": { "$numberDouble": "0.1654" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.1654" },
            "similarity": { "$numberDouble": "83.46" }
          },
          "crime": {
            "raw_diff": { "$numberDouble": "0.1067" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.1067" },
            "similarity": { "$numberDouble": "89.33" }
          },
          "annual_avg_temp": {
            "raw_diff": { "$numberDouble": "0.1952" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.1952" },
            "similarity": { "$numberDouble": "80.48" }
          },
          "rent_0_bedroom": {
            "raw_diff": { "$numberDouble": "0.2011" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.2011" },
            "similarity": { "$numberDouble": "79.89" }
          },
          "rent_2_bedroom": {
            "raw_diff": { "$numberDouble": "0.044" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.044" },
            "similarity": { "$numberDouble": "95.6" }
          },
          "rent_1_bedroom": {
            "raw_diff": { "$numberDouble": "0.0787" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0787" },
            "similarity": { "$numberDouble": "92.13" }
          },
          "rent_3_bedroom": {
            "raw_diff": { "$numberDouble": "0.0726" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0726" },
            "similarity": { "$numberDouble": "92.74" }
          },
          "rent_4_bedroom": {
            "raw_diff": { "$numberDouble": "0.1008" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.1008" },
            "similarity": { "$numberDouble": "89.92" }
          },
          "avg_rent": {
            "raw_diff": { "$numberDouble": "0.0405" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.0405" },
            "similarity": { "$numberDouble": "95.95" }
          },
          "Education": {
            "raw_diff": { "$numberDouble": "0.1042" },
            "weight": { "$numberDouble": "1.0" },
            "weighted_diff": { "$numberDouble": "0.1042" },
            "similarity": { "$numberDouble": "89.58" }
          }
        }
      },
      // Other cities would follow the same pattern...
      // I've included just New York and Los Angeles for brevity
    ],
    "timestamp": "2025-04-29T17:28:53.053655"
  };

  */
    const navigate = useNavigate();
  
  // Process the data to extract and format cities
  /* const matchedCities = data.matched_cities
    .map(city => ({
      name: `${city.city}, ${city.state}`,
      matchPercentage: parseFloat(city.match_percentage.$numberDouble),
      topCategories: Object.entries(city.category_match)
        .map(([category, details]) => ({
          category,
          similarity: parseFloat(details.similarity.$numberDouble)
        }))
        .sort((a, b) => b.similarity - a.similarity) // Sort by highest similarity
        .slice(0, 4) // Take top 4 categories
    }))
    .sort((a, b) => b.matchPercentage - a.matchPercentage) // Sort cities by match percentage
    .slice(0, 10); // Take top 10 cities

    */
  // Format category names for display
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
  const userId = "c4a84428-c0d1-70a3-92a9-1dfa4fcbfe7b";

  console.log('Received userId:', userId);

  useEffect(() => {
    const getMatchData = async () => {
      try {
        console.log("Fetching match data for user:", userId);
        const result = await fetchMatchedCities(userId);
        console.log("Fetched match result:", result);

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
      {matchCities.length === 0 && !error && <p>No matched cities found.</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="cities-grid">
        {matchCities.map((city, index) => (
          <div key={index} className="city-card">
            {/* Column 1: City Name and Button */}
            <div className="city-info">
              <h2>{city.name}</h2>
              <button className="more-info-button" onClick={() => handleNavigate(city)}>More Information</button>
            </div>

            {/* Column 2: Top Matching Categories */}
            <div className="preferences-box">
              <h3>Top Matching Categories</h3>
              <ul>
                {city.topCategories.map((category, i) => (
                  <li key={i}>
                    {formatCategoryName(category.category)}: {category.similarity !== undefined ? category.similarity.toFixed(1) : 'N/A'}%
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
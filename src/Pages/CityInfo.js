import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoremIpsum from '../Components/LoremIpsum';
import { GoogleGenAI } from "@google/genai";
import '../CSS/CityInfo.css';
import { useAuth } from "react-oidc-context";
import { fetchMatchedCities } from "../Components/api";

function CityInfo() {
  const { state } = useLocation();
  const city = state?.city;
  const navigate = useNavigate();
  const [aiDescription, setAiDescription] = useState('');
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [error, setError] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const auth = useAuth();
  const userId = "c4a84428-c0d1-70a3-92a9-1dfa4fcbfe7b";

  const ai = new GoogleGenAI({ apiKey: "AIzaSyCQQUQEjxfKWuPqU8uKu_PcaGr7TsMyRZM" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!city) return;

    const fetchCityDescription = async () => {
      setLoadingDescription(true);
      setError(null);
      
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-lite",
          contents: `Give me a two paragraph description of ${city.name}, ${city.state}. Include what the city is known for.`,
        });
        console.log(response.text)
        setAiDescription(response.text);
      } catch (err) {
        console.error("Failed to fetch city description:", err);
        setError("Failed to load city description");
        setAiDescription("");
      } finally {
        setLoadingDescription(false);
      }
    };

    fetchCityDescription();
  }, [city]); 

  useEffect(() => {
    if (!userId || !city) return;

    const getMatchData = async () => {
      setLoadingMatch(true);
      try {
        const result = await fetchMatchedCities(userId);
        if (result?.matched_cities) {
          const currentCityData = result.matched_cities.find(
            c => c.city.trim() === city.name && c.state.trim() === city.state
          );
          
          if (currentCityData) {
            setMatchData({
              matchPercentage: currentCityData.match_percentage ?? 0,
              topCategories: Object.entries(currentCityData.category_match || {})
                .map(([category, details]) => ({
                  category,
                  similarity: details?.similarity ?? 0
                }))
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 4)
            });
          }
        }
      } catch (err) {
        console.error("Error fetching match results:", err);
      } finally {
        setLoadingMatch(false);
      }
    };

    getMatchData();
  }, [userId, city]);

  if (!city) {
    return <div className="city-not-found">City data not found</div>;
  }

  const formatCategoryName = (category) => {
    const formatted = category.replace(/_/g, ' ');
    return formatted.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="city-info-container">
      <div className="city-header">
        <button className="return-button" onClick={() => navigate(-1)}>Return</button>
        <h1>{city.name}, {city.state}</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="content-wrapper">
        <div className="main-content-section">
          <div className="about-section">
            <h2>About This City</h2>
            {loadingDescription ? (
              <div className="loading-container">
                <div className="loader"></div>
              </div>
            ) : error ? (
              <div className="error-message">
                {error}
                <LoremIpsum /> 
              </div>
            ) : aiDescription ? (
              <div className="description-content">
                <p>{aiDescription}</p>
              </div>
            ) : (
              <LoremIpsum /> 
            )}
          </div>

          <div className="compatibility-section">
            <h2>Compatibility</h2>
            {loadingMatch ? (
              <div className="loading-container">
                <div className="loader"></div>
              </div>
            ) : matchData ? (
              <>
                <div className="match-percentage">
                  <h3>Match Percentage</h3>
                  <p>{matchData.matchPercentage.toFixed(1)}%</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={matchData.matchPercentage}
                    disabled
                  />
                </div>
                <div className="preferences-box">
                  <h3>Top Matching Categories</h3>
                  <ul>
                    {matchData.topCategories.map((category, i) => (
                      <li key={i}>
                        {formatCategoryName(category.category)}: {category.similarity.toFixed(1)}%
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p>No compatibility data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityInfo;
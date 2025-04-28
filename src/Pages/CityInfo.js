import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoremIpsum from '../Components/LoremIpsum';
import { GoogleGenAI } from "@google/genai";
import '../CSS/CityInfo.css';

function CityInfo() {
  const { state } = useLocation();
  const city = state?.city;
  const navigate = useNavigate();
  const [aiDescription, setAiDescription] = useState('');
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [error, setError] = useState(null);

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

  if (!city) {
    return <div className="city-not-found">City data not found</div>;
  }

  return (
    <div className="city-info-container">
      {/* Header Section */}
      <div className="city-header">
        <button className="return-button" onClick={() => navigate(-1)}>
          ← Return
        </button>
        <h1 className="city-title">{city.name}, {city.state}</h1>
        <div className="header-spacer"></div>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        {/* Left Column - City Info */}
        <div className="city-description-card">
          <h2 className="section-title">
            About This City
            <span className="title-underline"></span>
          </h2>
        
          {loadingDescription ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="error-message">
              <h3>⚠️ {error}</h3>
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

        {/* Right Column - Compatibility */}
        <div className="compatibility-card">
          <h2 className="compatibility-title">Compatibility</h2>
          <div className="match-percentage-container">
            <h3 className="match-subtitle">Match Percentage</h3>
            <div className="percentage-value">75%</div>
            <input
              type="range"
              min="0"
              max="100"
              value="75"
              disabled
              className="percentage-slider"
            />
            <div className="match-label">
              <div className="high-match">High Match</div>
            </div>
          </div>
        </div>
      </div>

      {/* More Information Section */}
      <div className="more-info-card">
        <h2 className="section-title">
          More Information
          <span className="title-underline"></span>
        </h2>
        <div className="info-content">
          <LoremIpsum />
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        {/* City Features */}
        <div className="features-card city-features">
          <h3 className="features-title">City Features</h3>
          <ol className="features-list">
            {['Public Transport', 'Liberal', 'Restaurant Quality', 'Career (Software Engineer)'].map((item, index) => (
              <li key={index} className="feature-item">
                {item}
              </li>
            ))}
          </ol>
        </div>

        {/* Preference Match */}
        <div className="features-card preference-match">
          <h3 className="features-title">Preference Match</h3>
          <ol className="preference-list">
            {[90, 85, 70, 80].map((percent, index) => (
              <li key={index} className="preference-item">
                <div className="percentage-bar" style={{ width: `${percent}%` }}></div>
                <span className="percentage-value">{percent}%</span>
              </li>
            ))}
          </ol>
        </div>

        {/* You */}
        <div className="features-card your-preferences">
          <h3 className="features-title">You</h3>
          <ol className="preferences-list">
            {['Public Transport', 'Liberal', 'Restaurant Quality', 'Career (Software Engineer)'].map((item, index) => (
              <li key={index} className="preference-item">
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default CityInfo;
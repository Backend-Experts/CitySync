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
            <div className="match-percentage">
              <h3>Match Percentage</h3>
              <p>75%</p>
              <input
                type="range"
                min="0"
                max="100"
                value="75"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="more-info-section">
          <h2>More Information</h2>
          <LoremIpsum />
        </div>

        <div className="features-section">
          <div className="feature-column">
            <h3>City Features</h3>
            <ol>
              <li>Public Transport</li>
              <li>Liberal</li>
              <li>Restaurant Quality</li>
              <li>Career (Software Engineer)</li>
            </ol>
          </div>
          <div className="feature-column">
            <h3>Preference Match</h3>
            <ol>
              <li>90%</li>
              <li>85%</li>
              <li>70%</li>
              <li>80%</li>
            </ol>
          </div>
          <div className="feature-column">
            <h3>You</h3>
            <ol>
              <li>Public Transport</li>
              <li>Liberal</li>
              <li>Restaurant Quality</li>
              <li>Career (Software Engineer)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityInfo;
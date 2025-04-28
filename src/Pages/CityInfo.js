import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoremIpsum from '../Components/LoremIpsum';
import { GoogleGenAI } from "@google/genai";

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
        setAiDescription(""); // Clear any previous description on error
      } finally {
        setLoadingDescription(false);
      }
    };

    fetchCityDescription();
  }, [city]); 

  if (!city) {
    return <div>City data not found</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)}>Return</button>
        <h1 style={{ textAlign: 'center', flexGrow: 1, margin: 0 }}>{city.name}, {city.state}</h1>
        <div style={{width:'100px'}}></div>
      </div>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          <img
            src="https://placehold.co/600x400"
            alt="City"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2>Compatibility</h2>
          <div className="match-percentage">
              <h3>Match Percentage</h3>
              <p>75%</p>
              <input
                type="range"
                min="0"
                max="100"
                value="75%"
                disabled // Slider is read-only
              />
            </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h2>About This City</h2>
        
        {/* Loading and content display logic */}
        {loadingDescription ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100px',
            margin: '20px 0'
          }}>
            <div className="loader" style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div style={{ color: '#ff6b6b', margin: '20px 0' }}>
            {error}
            <LoremIpsum /> 
          </div>
        ) : aiDescription ? (
          <div style={{ margin: '20px 0' }}>
            <p>{aiDescription}</p>
          </div>
        ) : (
          <LoremIpsum /> 
        )}

        <h2>More Information</h2>
        <LoremIpsum />
      </div>

      <div style={{ marginTop: '20px', display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          <h3>City Features</h3>
          <ol>
            <li>Public Transport</li>
            <li>Liberal</li>
            <li>Restaurant Quality</li>
            <li>Career (Software Engineer)</li>
          </ol>
        </div>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          <h3>Preference Match</h3>
          <ol>
            <li>90%</li>
            <li>85%</li>
            <li>70%</li>
            <li>80%</li>
          </ol>
        </div>
        <div style={{ flex: 1 }}>
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
  );
}

export default CityInfo;
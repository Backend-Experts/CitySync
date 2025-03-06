import React from 'react';
import LoremIpsum from '../Components/LoremIpsum';

function CityInfo() {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button>Return</button>
        <h1 style={{ textAlign: 'center', flexGrow: 1, margin: 0 }}>City Name</h1>
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
          <p>75%</p>
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h2>About This City</h2>
        <LoremIpsum />

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
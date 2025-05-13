import React from 'react';
import '../CSS/HomePage.css';
import LeafletMap from '../Components/LeafletMap';
import LoremIpsum from '../Components/LoremIpsum';

function HomePage() {
  return (
    <div className="homepage-container">
      {/* Simplified Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to CitySync</h1>
          <p className="hero-subtitle">Your personal city matchmaker</p>
          <p className="hero-subtitle">Data-driven city matching for your ideal lifestyle</p>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="map-section">
        <h2>Discover Your City</h2>
        <div className="map-container">
          <LeafletMap />
        </div>
        <p className="map-instructions">Click on the map to explore points of interest</p>
      </section>

      {/* Updated Features Section */}
<section className="features-section">
  <h2>Why Choose CitySync?</h2>
  <div className="features-grid">
    {/* Top Row - 3 Cards */}
    <div className="feature-row top-row">
      <div className="feature-card">
        <div className="feature-icon">⚡</div>
        <h3>Smart Matching</h3>
        <p>Our algorithm finds cities that perfectly fit your lifestyle.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🔄</div>
        <h3>Live Data</h3>
        <p>Always current information on cities and neighborhoods.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">✨</div>
        <h3>Simple Questions</h3>
        <p>Just a few easy questions to get started.</p>
      </div>
    </div>
    
    {/* Bottom Row - 2 Cards (centered) */}
    <div className="feature-row bottom-row">
      <div className="feature-card">
        <div className="feature-icon">⚡</div>
        <h3>Instant Results</h3>
        <p>Get your city matches in seconds.</p>
      </div>
      <div className="feature-card">
        <div className="feature-icon">👍</div>
        <h3>Easy Comparisons</h3>
        <p>Side-by-side views of your best matches.</p>
      </div>
    </div>
  </div>
</section>

      {/* About Section */}
      <section className="about-section">
  <h2>About CitySync</h2>
  <div className="about-content">
    <p>
      CitySync is an innovative urban analytics platform designed to help individuals and families 
      find their perfect hometown match. By combining advanced data algorithms with personalized 
      preference filters, we analyze thousands of data points across cities nationwide to identify 
      locations that align with your lifestyle, budget, and aspirations.
    </p>
    <p>
      Our platform evaluates key factors including cost of living, job markets, school quality, 
      climate patterns, cultural amenities, and community characteristics to generate tailored 
      recommendations. Whether you're relocating for work, seeking better schools, or just craving 
      a change of scenery, CitySync takes the guesswork out of finding your ideal community.
    </p>
  </div>
  <div className="testimonials">
    <blockquote>
      "After months of struggling to find the perfect new hometown, CitySync helped me discover 
      the ideal city that matched all my needs and preferences!"
      <cite>- Relocated & Happy User</cite>
    </blockquote>
  </div>
</section>

      {/* Footer Section with Credits and Last Updated */}
      <footer className="footer-section">
        <div className="developer-credits">
          <h3>Development Team</h3>
          <p>Johnathon Brumfield, Eric Chin, Manuel Belaustegui, Sathwik Jupalli, and Bond Leung</p>
        </div>
        <div className="last-updated">
          <p>Last Updated: May 12, 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
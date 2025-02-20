import React from "react";
import "../CSS/App.css"; // Using standard CSS for styling

const App = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1>CitySync</h1>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h2>Explore Your City Like Never Before</h2>
        <p>CitySync helps you connect with events, attractions, and people in your city.</p>
        <button>Download the App</button>
      </header>

      {/* Features Section */}
      <section id="features" className="section">
        <h3>Why Use CitySync?</h3>
        <div className="features">
          <div className="feature-box">
            <h4>Find Events</h4>
            <p>Discover local events and activities happening around you.</p>
          </div>
          <div className="feature-box">
            <h4>Connect with People</h4>
            <p>Meet others with similar interests and make new friends.</p>
          </div>
          <div className="feature-box">
            <h4>Explore New Places</h4>
            <p>Find hidden gems, cafes, and attractions in your city.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section testimonials">
        <h3>What Our Users Say</h3>
        <blockquote>"CitySync completely changed how I explore my city! So many great events!"</blockquote>
        <p>- Alex, 25</p>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h3>Get Started with CitySync</h3>
        <button>Download Now</button>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <p>Contact us at <a href="mailto:support@citysync.com">support@citysync.com</a></p>
        <p>&copy; {new Date().getFullYear()} CitySync. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
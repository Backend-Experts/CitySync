import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="navbar-logo-link">
            YourAppLogo
          </Link>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link">
              About
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link">
              Contact
            </Link>
          </li>
          {/* Add more navigation items as needed */}
        </ul>
        {/* Optional: Add user profile or authentication links */}
        <div className="navbar-auth">
          <Link to="/login" className="navbar-link">
            Login
          </Link>
          <Link to="/signup" className="navbar-link">
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const Navbar = ({ signOutRedirect }) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSignOut = async () => {
    try {
      await auth.removeUser();
      navigate("/");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <button 
            className="nav-link"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </li>
        <li className="nav-item">
          <button 
            className="nav-link"
            onClick={() => navigate("/questionaire")}
          >
            Questionnaire
          </button>
        </li>
        <li className="nav-item">
          <button 
            className="nav-link"
            onClick={() => navigate("/resultspage")}
          >
            Results
          </button>
        </li>
        <li className="nav-item">
          <button 
            className="nav-link"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
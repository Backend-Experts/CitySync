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
    <div className="navbar">
      <ul>
        <li>
          <button 
            className="nav-button" 
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </li>
        <li>
          <button 
            className="nav-button" 
            onClick={() => navigate("/questionaire")}
          >
            Questionaire
          </button>
        </li>
        <li>
          <button 
            className="nav-button" 
            onClick={() => navigate("/resultspage")}
          >
            ResultsPage
          </button>
        </li>
        <li>
          <button className="nav-button" onClick={handleSignOut}>
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
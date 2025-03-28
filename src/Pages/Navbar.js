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
          <NavLink className={({ isActive }) => isActive ? "active content" : "content"} to="/">Home</NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => isActive ? "active content" : "content"} to="/questionaire">Questionaire</NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => isActive ? "active content" : "content"} to="/cityinfo">City Info</NavLink>
        </li>
        <li>
          <NavLink className={({ isActive }) => isActive ? "active content" : "content"} to="/resultspage">ResultsPage</NavLink>
        </li>
        <li>
          <button onClick={handleSignOut}>Sign out</button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
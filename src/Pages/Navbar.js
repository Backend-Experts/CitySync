import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ signOutRedirect }) => {
  const navigate = useNavigate();

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
          <button onClick={signOutRedirect}>Sign out</button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
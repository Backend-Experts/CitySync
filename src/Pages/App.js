import React from "react";
import "../CSS/App.css"; // Using standard CSS for styling
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Login from "./Login";
import HomePage from "./HomePage";
import Blank from "./Blank";
import Questionaire from "./Questionaire";
import CityInfo from "./CityInfo";
import ResultsPage from "./ResultsPage";

const App = () => {
  return (
    <Router>
      <div className="navbar">
        <ul>
          <li>
            <NavLink className={({ isActive }) => isActive ? "active content" : "content"} to="/">Home</NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => isActive ? "active content" : "content"} to="/login">Login</NavLink>
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
        </ul>
      </div>
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questionaire" element={<Questionaire />} />
          <Route path="/cityinfo" element={<CityInfo />} />
          <Route path="/resultspage" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

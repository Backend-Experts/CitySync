import React from "react";
import "../CSS/App.css"; // Using standard CSS for styling
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Login from "./Login";
import HomePage from "./HomePage";
import Blank from "./Blank";

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
            <NavLink className={({ isActive }) => isActive ? "active content" : "content"} to="/blank">Blank</NavLink>
          </li>
        </ul>
      </div>
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blank" element={<Blank />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

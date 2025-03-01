import React from "react";
import "../CSS/App.css"; // Using standard CSS for styling
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Login from "./Login";

const App = () => {
  return (
    <div>
      <Router> 
        <div>
          <NavLink exact activeClassName="active" to="/">Login</NavLink>
        </div>
        <Routes>
          <Route path="/" element={<Login />}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
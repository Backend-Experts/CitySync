import React from "react";
import "../CSS/App.css"; // Using standard CSS for styling
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Questionaire from "./Questionaire";
import CityInfo from "./CityInfo";
import ResultsPage from "./ResultsPage";
import { useAuth } from "react-oidc-context";
import Navbar from "./Navbar"; // Import the Navbar component

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <Router>
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/questionaire" element={<Questionaire />} />
            <Route path="/cityinfo" element={<CityInfo />} />
            <Route path="/resultspage" element={<ResultsPage />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
}

<<<<<<< Updated upstream
export default App;
=======

export default App;
/*

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Navbar from './Navbar';
import '../CSS/App.css';

function App() {
  return (
      <div className="App">
        <Navbar />
        <main>
          <HomePage />
        </main>
      </div>
  );
}

export default App;*/
>>>>>>> Stashed changes

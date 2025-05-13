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
    <div className="sign-in-page">
      <div className="sign-in-container">
        <h1>Welcome to CitySync</h1>
        <p>Your personalized city matching app</p>
        <button className="sign-in-button" onClick={() => auth.signinRedirect()}>
          Sign In to Get Started
        </button>
      </div>
    </div>
  );
}

export default App;

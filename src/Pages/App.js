import React from "react";
import "../CSS/App.css"; // Using standard CSS for styling
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Login from "./Login";
import HomePage from "./HomePage";
import Questionaire from "./Questionaire";
import CityInfo from "./CityInfo";
import ResultsPage from "./ResultsPage";
import { useAuth } from "react-oidc-context";
import Navbar from "./Navbar"; // Import the Navbar component

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "6uaaq3d4tb4oduptof01ju1vgg";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://<user pool domain>";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <Router>
        <Navbar signOutRedirect={signOutRedirect} />
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

export default App;
// Home page should link to questionaire pages and user review page and profile page and result page
// additionally login and signup and learn more about the app

// some of these features might fit better in a landing page

// Questions:
// Is the login/signup part of the navbar?
// 

import React from 'react';
import '../CSS/HomePage.css';

function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome!</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Quick Overview</h2>
        <p>
          Here's a snapshot of your recent activity. You can quickly access important information and key metrics.
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Recent Activity</h2>
        <ul>
          <li>Updated profile settings</li>
          <li>Viewed latest reports</li>
          <li>Uploaded a new document</li>
        </ul>
      </div>

      <div>
        <h2>Key Metrics</h2>
        <p>
          Here you will find some key metrics and data visualizations. (Place holders for graphs and data)
        </p>
      </div>
    </div>
  );
}

export default HomePage;
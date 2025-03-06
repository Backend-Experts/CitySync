// Home page should link to questionaire pages and user review page and profile page and result page
// additionally login and signup and learn more about the app

// some of these features might fit better in a landing page

// Questions:
// Is the login/signup part of the navbar?
// maybe map, general info
// about citysync

// Make alaska smaller and hawaii bigger and move both of them to better locations
// tailwind?

import React from 'react';
import '../CSS/HomePage.css';
import LeafletMap from '../Components/LeafletMap';
import LoremIpsum from '../Components/LoremIpsum';

function HomePage() {
  return (
    <div>
      <h1>Welcome!</h1>
      <LeafletMap />
      <h2>What is CitySync?</h2>
      <LoremIpsum />
    </div>
    // <div style={{ padding: '20px' }}>
    //   <h1>Welcome!</h1>

    //   <div style={{ marginBottom: '20px' }}>
    //     <h2>Quick Overview</h2>
    //     <p>
    //       Here's a snapshot of your recent activity. You can quickly access important information and key metrics.
    //     </p>
    //   </div>

    //   <div style={{ marginBottom: '20px' }}>
    //     <h2>Recent Activity</h2>
    //     <ul>
    //       <li>Updated profile settings</li>
    //       <li>Viewed latest reports</li>
    //       <li>Uploaded a new document</li>
    //     </ul>
    //   </div>

    //   <div>
    //     <h2>Key Metrics</h2>
    //     <p>
    //       Here you will find some key metrics and data visualizations. (Place holders for graphs and data)
    //     </p>
    //   </div>
    // </div>
  );
}

export default HomePage;
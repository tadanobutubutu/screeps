import React from 'react';
import './App.css';

// SVG data URLs for icons
const iconData = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90%">🐛</text></svg>';
const appleData = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90%">🐛</text></svg>';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Favicon icon – decorative */}
        <img src={iconData} alt="" aria-hidden="true" />
        {/* Apple icon – decorative */}
        <img src={appleData} alt="" aria-hidden="true" />
        <nav>
          <a href="/" className="App-link">
            Home
          </a>
        </nav>
      </header>
      <main>
        {/* Rest of the application */}
      </main>
    </div>
  );
}

export default App;
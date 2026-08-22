import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Function to render the favicon with accessible name
const renderFavicon = (faviconData) => {
  return `<link rel="icon" href="data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${faviconData}</svg>">`;
};

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <body>
        <main>
          <App />
          {renderFavicon('<title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text>')}
        </main>
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);
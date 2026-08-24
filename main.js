// Existing main.js content
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// New changes to fix React SVG accessible name warnings
import { icons } from './icons'; // Assuming icons are defined elsewhere

function Favicon() {
  return (
    <link
      rel="icon"
      href={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard">
        <title>Screeps Dashboard</title>
        <text y="0.9em" font-size="90">🐛</text>
      </svg>`}
    />
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Favicon />
  </React.StrictMode>,
  document.getElementById('root')
);
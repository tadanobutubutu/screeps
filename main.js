// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks
// - REACT_036: Fix 1 fake link issue

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { icons } from './icons';

// Accessible SVG favicon setup
function setupFavicon() {
  const link = document.querySelector("link[rel='icon']");
  if (link) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Screeps Dashboard">
        <title>Screeps Dashboard</title>
        <circle cx="50" cy="50" r="45" fill="#1a1a2e"/>
        <text x="50" y="55" text-anchor="middle" font-size="24" fill="#fff">SD</text>
      </svg>
    `;
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
}

function Favicon() {
  useEffect(() => {
    setupFavicon();
  }, []);
  return null;
}

function AccessibleIcon({ icon }) {
  // Accessible SVG icon component with proper landmarks and names
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      role="img" 
      aria-label={`Icon: ${icon.name}`}
    >
      <title>{icon.name}</title>
      <desc>{icon.description || `Accessible icon for ${icon.name}`}</desc>
      {/* SVG paths */}
    </svg>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Favicon />
  </React.StrictMode>,
  document.getElementById('root')
);
// main.js

// Import existing code, exports, and functions
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Import the SVG icons with added accessibility attributes
import favicon from './icons/favicon';
import appleIcon from './icons/apple-icon';

// Function to add accessibility attributes to SVGs
function addAccessibilityToSVG(svgData) {
  return svgData.replace(/<svg/g, `<svg aria-label="Screeps Dashboard"`);
}

// Update the favicon with accessibility attributes
const accessibleFavicon = addAccessibilityToSVG(favicon);
const accessibleAppleIcon = addAccessibilityToSVG(appleIcon);

// Assume that the App component uses the icons in some way
const appElement = (
  <App
    favicon={accessibleFavicon}
    appleIcon={accessibleAppleIcon}
    // ... other props
  />
);

ReactDOM.render(appElement, document.getElementById('root'));
import React from 'react';
import { useEffect } from 'react';

// Assuming main.js is the entry point for your Screeps bot application

// Import the icons from the respective files
const icons = require('./app/layout.tsx').icons; // For app/layout.tsx
const dashboardIcons = require('./dashboard/app/layout.tsx').icons; // For dashboard/app/layout.tsx

// Create a function to add aria-label to the SVG data string
function addAriaLabelToSvg(svgData, label) {
  return svgData.replace(/<svg /, `<svg aria-label="${label} "`);
}

// Update the SVG data with an accessible name for both icons
const updatedIcons = {
  ...icons,
  icon: addAriaLabelToSvg(icons.icon, 'Screeps Dashboard Icon'),
};

const updatedDashboardIcons = {
  ...dashboardIcons,
  icon: addAriaLabelToSvg(dashboardIcons.icon, 'Screeps Dashboard Icon'),
};

// Merge the updated icons
const allIcons = { ...updatedIcons, ...updatedDashboardIcons };

// Imported from both branches, combined and modified for cleaner structure
function addLangAttribute() {
  useEffect(() => {
    const lang = document.documentElement.lang || 'en';
    document.documentElement.lang = lang;
  }, []);
}

// Imported from both branches, combined and modified for cleaner structure
function addMainLandmark() {
  useEffect(() => {
    const mainElement = document.querySelector('main, [role="main"]');
    if (!mainElement) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      document.body.insertBefore(main, document.body.firstChild);
    }
  }, []);
}

// Export the merged icons
module.exports = allIcons;
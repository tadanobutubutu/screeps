function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// Commit: a1b76c558a04b5add2d9001c234dd80c5c58ff6c

import React from 'react';

import {
  getLangAttribute,
  getFullLangAttribute,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createAccessibleLink,
} = require('./utils/a11y-helpers');

const affectedFunctions = {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = require('./utils/accessibility');

const affectedFunctions = {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
};

function addLangAttribute() {
  document.documentElement.lang = 'en';
}

function addMainLandmark() {
  // Add main landmark functionality
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach((main, index) => {
    if (!main.id) {
      main.id = `main-landmark-${index}`;
    }
  });
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
      const title = document.createElement('title');
      title.id = `svg-title-${index}`;
      title.textContent = svg.id ? `SVG icon: ${svg.id}` : `SVG icon ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], [role="contentinfo"], [role="complementary"]');
  const landmarkTypes = {};
  
  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    if (!landmarkTypes[tag]) {
      landmarkTypes[tag] = [];
    }
    landmarkTypes[tag].push(landmark);
  });
  
  Object.keys(landmarkTypes).forEach(type => {
    const landmarksOfType = landmarkTypes[type];
    if (landmarksOfType.length > 1) {
      landmarksOfType.forEach((landmark, index) => {
        if (index > 0) {
          landmark.removeAttribute('role');
        }
      });
    }
  });
}

function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.href && !link.getAttribute('onclick') && link.getAttribute('role') !== 'button') {
      link.setAttribute('role', 'presentation');
    }
  });
}

export default function RootLayout({ children }) {
  if (typeof window !== 'undefined') {
    addLangAttribute();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
  }

  const links = ...
  const buttons = ...

  links.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'link');
    }
    if (!link.getAttribute('href') && !link.getAttribute('onclick') && link.getAttribute('role') !== 'button') {
      console.error('Link without href attribute', link);
    }
  });

  buttons.forEach(button => {
    if (!button.textContent.trim() && !button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
      button.setAttribute('role', 'button');
    }
    if (!button.textContent.trim() && !button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
      console.error('Button without accessible name', button);
    }
  });

  // Table accessibility checks
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    const headers = table.querySelectorAll('th');
    const caption = table.querySelector('caption');
    const hasAriaLabel = table.getAttribute('aria-label');
    const hasAriaLabelledBy = table.getAttribute('aria-labelledby');
    
    // Check if table has proper headers
    if (headers.length === 0) {
      console.warn(`Table at index ${index} has no <th> elements. Consider adding header cells for accessibility.`);
    }
    
    // Check if table has a caption or accessible name
    if (!caption && !hasAriaLabel && !hasAriaLabelledBy) {
      console.warn(`Table at index ${index} has no caption or accessible name. Consider adding a <caption> or aria-label for context.`);
    }
    
    // Check if table has a summary via aria-describedby for complex tables
    const hasAriaDescription = table.getAttribute('aria-describedby');
    const isComplexTable = table.querySelectorAll('th[scope]').length > 0 || headers.length > 3;
    if (isComplexTable && !hasAriaDescription) {
      console.warn(`Table at index ${index} appears complex but has no aria-describedby for additional context.`);
    }
  });

  return (
    <html lang="en">
      <head>
        <title>Screeps Dashboard</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
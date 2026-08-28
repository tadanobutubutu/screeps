import React, { useState } from 'react';

// New function to get the lang attribute based on user's language preference or 'en' as a fallback
function getLangAttribute() {
  const navigatorLanguage = navigator.language || navigator.userLanguage;
  const fallbackLang = 'en';
  return navigatorLanguage.substring(0, 2) || fallbackLang;
}

// New function to validate and set the lang attribute on the main HTML element
function setLangAttribute() {
  const lang = getLangAttribute();
  document.documentElement.setAttribute('lang', lang);
}

// New function to set the accessible name for an SVG
function getSvgAccessibleName(svgId: string) {
  const svg = document.getElementById(svgId);
  if (svg) {
    svg.setAttribute('aria-labelledby', `${svgId}_label`);
    const title = svg.getAttribute('title');
    const desc = svg.getAttribute('desc');
    const labelId = `${svgId}_label`;
    const accessibleName = title ? `${title}\n${desc}` : `${svg.namespaceURI}:${svgId}`;
    const labelEl = document.createElement('span');
    labelEl.id = labelId;
    labelEl.textContent = accessibleName;
    svg.parentNode.insertBefore(labelEl, svg);
  }
}

// New function to validate and set landmarks
function validateLandmark(landmarkType: string, id: string) {
  const landmarkEl = document.getElementById(id);
  if (landmarkEl) {
    landmarkEl.setAttribute('role', landmarkType);
  }
}

// Add landmark roles for navigation and banner
validateLandmark('banner', 'error-banner');
validateLandmark('navigation', 'error-nav');

// Update Dashboard component to call setLangAttribute() on component mount
// and use the new functions to set the languages and accessible names for SVGs
const Dashboard: React.FC<DashboardProps> = (props) => {
  // ... (existing code)

  React.useEffect(() => {
    setLangAttribute();
    // Add unique IDs for your SVGs and call getSvgAccessibleName() for each one
    getSvgAccessibleName('svg1');
    getSvgAccessibleName('svg2');
  }, []);

  // ... (existing code)
};

export default Dashboard;
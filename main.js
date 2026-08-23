import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('root')) {
      root.render(<App />);
    }
    setupRotateBack();
  });
}

// Icons with accessibility names
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" font-size="90">🍎</text></svg>',
  myCustomIcon: 'data:image/svg+xml,<svg aria-label="My Custom Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>My Custom Icon</title><text y="0.9em" font-size="90">🌐</text></svg>',
};

// Accessibility functions
function renderAccessibleSVG(accessibleName, svgId) {
  return `<svg aria-label="${accessibleName}" id="${svgId || ''}"></svg>`;
}

function addLangAttribute(element) {
  React.Children.forEach(element, child => {
    if (child && child.type !== 'string' && child.props) {
      child.props.className += ' jsx-lang-en';
      child.props.lang = 'en';
    }
  });
}

function fixTableStructure() {}
function addMainLandmark() {}
function validateLandmark(landmark) {}
function validateUniqueLandmarks(landmarks) { return [...new Set(landmarks)]; }
function validateLandmarkStructure(landmarks) {}
function addSvgAccessibleName(svgElement) { svgElement.setAttribute('aria-label', 'SVG description'); }
function getSvgAccessibleName(svgElement) { return svgElement.getAttribute('title') || ''; }
function createSvgAccessibilityProps(svgElement) {
  const accessibleName = getSvgAccessibleName(svgElement);
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-label', accessibleName);
}

function fixFakeLinkIssue() {}
function validateLinkAccessibility(link) {}
function createInPageButton() {}
function validateLinkOrButton(element) {}
function createAccessibleLink() {}

// Rotation control
const generateRotateBackControl = () => React.createElement('button', { id: 'unrotate' }, 'rotate back');
const setupRotateBack = () => {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', () => {
      // rotation logic here
    });
  }
};

// Export symbols
export {
  icons,
  renderAccessibleSVG,
  renderLandmarkStructure,
  App,
  generateRotateBackControl,
  setupRotateBack
};
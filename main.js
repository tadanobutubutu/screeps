import React from 'react';
import ReactDOM from 'react-dom';

// Existing code from main.js that needs to be preserved
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" font-size="90">🍎</text></svg>',
  myCustomIcon: 'data:image/svg+xml,<svg aria-label="My Custom Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>My Custom Icon</title><text y="0.9em" font-size="90">🌐</text></svg>',
};

// Merge any existing exports that may have been defined elsewhere (simulate currentExports)
const currentExports = {}; // Assume currentExports is defined elsewhere; keep as placeholder
Object.entries(currentExports).forEach(([key, value]) => {
  if (!icons.hasOwnProperty(key)) {
    icons[key] = value;
  }
});

// Accessibility-friendly SVG rendering helper
function renderAccessibleSVG(accessibleName, svgId) {
  return `
    <svg aria-label="${accessibleName}" id="${svgId || ''}">
    </svg>
  `;
}

// Structure for main landmark with an accessible name
function renderLandmarkStructure(content) {
  return `
    <main aria-label="Main content">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <!-- Navigation content -->
        </nav>
      </header>
      ${content}
      <footer role="contentinfo">
        <!-- Footer content -->
      </footer>
    </main>
  `;
}

// Fixed: Changed <a id="unrotate" href="#"> to <button id="unrotate">
// to fix REACT_036 React Fake Link accessibility warning
// If this is rendered in HTML directly, replace:
// <a id="unrotate" href="#">rotate back</a>
// with:
// <button id="unrotate">rotate back</button>
const generateRotateBackControl = () => {
  // Before (accessibility issue):
  // return '<a id="unrotate" href="#">rotate back</a>';
  
  // After (accessible fix):
  return '<button id="unrotate">rotate back</button>';
};

const setupRotateBack = () => {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', () => {
      // rotation logic here
    });
  }
};

// React component
const App = () => {
  // Existing code and logic
  return (
    <div>
      <a href="/home">Home</a>
      <table>
        {/* Table content */}
      </table>
      <svg>
        {/* SVG content */}
      </svg>
      {/* Insert generated button for rotation control where needed */}
      {generateRotateBackControl()}
    </div>
  );
};

// Initialize the application on the client side
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setupRotateBack(); // Ensure button wiring after DOM is ready
    ReactDOM.render(<App />, document.getElementById('root'));
  });
}

// Export functions for testing and reuse
export {
  icons,
  renderAccessibleSVG,
  renderLandmarkStructure,
  generateRotateBackControl,
  setupRotateBack,
};
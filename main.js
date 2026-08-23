import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import layout from './layout';
import dashboardLayout from './dashboard/layout';

function wrapContentWithMain() {
  const contentToWrap = document.querySelector('div.container'); // Assuming primary content is within a div with class 'container'
  if (contentToWrap) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(contentToWrap);
    document.body.insertBefore(mainElement, document.body.firstChild);
  }
}

// Call the function to wrap the content with <main>
wrapContentWithMain();

// ... (Preserve all existing code, exports, and functions)

// Add the following changes to the `layout` and `dashboardLayout` components

// Replace the following line in the layout component
icons: { icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>' },

// With:
icons: { icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>' },

// Replace the following line in the dashboard layout component
icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>',
},

// With:
icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><text y="0.9em" font-size="90">🐛</text></svg>',
},

// Ensure that these changes are reflected in the actual codebase and tested to confirm that all tests pass.
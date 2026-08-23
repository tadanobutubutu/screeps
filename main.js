// Assuming this is the content of main.js and that the conflict markers are not present.

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import layout from './layout';
import dashboardLayout from './dashboard/layout';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <layout />
    <dashboardLayout />
  </React.StrictMode>,
  document.getElementById('root')
);

// Add the following changes to the `layout` and `dashboardLayout` components

// Replace the following line in the layout component
icons: { icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>' },

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
// Original main.js content with conflict markers

// <<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// =======
// Changes requested by the issue:

// Add aria-label to the SVG elements in the icons object
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Apple Icon</title><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>',
};

// >>>>>>> origin

// Rest of the main.js content
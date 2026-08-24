// Assuming main.js is structured to include imports and setup for the app
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Assuming the App component imports and uses the icons from a file
import icons from './icons';

// Update the icons object to include aria-hidden="true" for the SVGs
const updatedIcons = {
  ...icons,
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
};

// Export the updated icons object if it's being used elsewhere in the app
export { updatedIcons };
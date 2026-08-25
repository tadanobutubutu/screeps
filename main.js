Here is the resolved `main.js` file:

```javascript
// Assuming the `main.js` file contains the logic for setting up the application, including the components that are using the SVGs in question.

// Import necessary dependencies and modules
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Function to add accessible name to SVGs
function addAccessibleName(svgString) {
  // Replace the SVG string with a new string that includes an aria-label
  return svgString.replace('<svg', `<svg aria-label="Screeps Dashboard">`);
}

// Modify the SVGs in the icons object
const icons = {
  icon: addAccessibleName('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>'),
  apple: addAccessibleName('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard Apple Icon"><title>Screeps Dashboard Apple Icon</title><text y="0.9em" font-size="90">🐛</text></svg>'),
};

// Render the application
ReactDOM.render(
  <React.StrictMode>
    <App icons={icons} />
  </React.StrictMode>,
  document.getElementById('root')
);
```

This file includes the changes from both branches, which add accessible names to the SVGs and update the icons object to accommodate those changes. The rendered App component receives the icons object as a prop, as before.
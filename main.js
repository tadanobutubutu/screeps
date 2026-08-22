// main.js

// Original code (if present) with conflict markers
// <<<<<<< HEAD
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import './index.css';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// =======
// ... (conflict markers here)
// >>>>>>> branch-name

// New changes based on the issue to add aria-label or aria-hidden="true" to SVG elements

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Assuming that the App component uses the icons from the icons object
// and we need to modify it to include accessibility for SVGs

function App() {
  const icons = {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  };

  // Function to create an accessible SVG from a data URI
  const createAccessibleSVG = (dataURI, ariaLabel) => {
    return <img src={dataURI} alt={ariaLabel} />;
  };

  // Set language attribute on the HTML element for accessibility
  React.useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  return (
    <div>
      {/* Use the createAccessibleSVG function to make the SVGs accessible */}
      <div>{createAccessibleSVG(icons.icon, 'Screeps Dashboard')}</div>
      <div>{createAccessibleSVG(icons.apple, 'Screeps Apple Icon')}</div>
      {/* ... rest of the App component */}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
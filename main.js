// main.js

// Import React and required modules
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Helper function to create accessible SVG images from data URIs
const createAccessibleSVG = (dataURI, ariaLabel) => {
  return <img src={dataURI} alt={ariaLabel} />;
};

// Set language attribute for accessibility
React.useEffect(() => {
  document.documentElement.lang = 'en';
}, []);

function App() {
  const icons = {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  };

  return (
    <div>
      {/* Display accessible SVG icons */}
      <div>{createAccessibleSVG(icons.icon, 'Screps Dashboard')}</div>
      <div>{createAccessibleSVG(icons.apple, 'Screps Apple Icon')}</div>
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
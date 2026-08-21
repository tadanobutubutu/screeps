import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Adding a function to handle SVGs with accessible names
const renderAccessibleSVG = (svgData) => {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>`;
};

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <body>
        <App />
        {/* Updating the icons to include accessible names */}
        <link rel="icon" href={renderAccessibleSVG('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>')} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={renderAccessibleSVG('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>')} type="image/svg+xml" />
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);
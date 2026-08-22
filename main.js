tsx
// main.ts

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

function App() {
  const icons = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Apple Icon</title><text y=".9em" font-size="90">🐛</text></svg>',
  };

  const createAccessibleSVG = (dataURI, ariaLabel) => {
    return (
      <svg width="100" height="100">
        <title>{ariaLabel}</title>
        <image href={dataURI} x="0" y="0" width="100" height="100" />
      </svg>
    );
  };

  return (
    <div>
      {createAccessibleSVG(icons.icon, 'Screeps Dashboard')}
      {createAccessibleSVG(icons.apple, 'Screeps Apple Icon')}
      {/* ... rest of the App component */}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
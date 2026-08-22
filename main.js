import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App
      ariaLabel="Screeps Dashboard"
      appleAriaLabel="Screeps Apple Icon"
    />
  </React.StrictMode>,
  ...
);

function App({
  ariaLabel,
  appleAriaLabel,
}) {
  const icons = {
    icon: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em">...</text></svg>`,
    apple: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em">...</text></svg>`
  };

  const createAccessibleSVG = (dataURI, ariaLabel) => {
    return <img src={dataURI} alt={ariaLabel} />;
  };

  return (
    <main>
      <div>{createAccessibleSVG(icons.icon, ariaLabel)}</div>
      <div>{createAccessibleSVG(icons.apple, appleAriaLabel)}</div>
      {/* ... rest of the App component ... */}
    </main>
  );
}
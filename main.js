import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from 'node-libs-react/report-validator';

// Perserve the following import statements from both branches
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Initialize App using the preserved original import
import { initializeApp as initAppOrigin } from './app.js';

// Additional imports for accessibility
import { registerSW } from 'effector-sw';

// Accessibility fixes for React
registerSW({
  onNeedRefresh(registration) {
    const confirmRefresh = confirm('A new version of the app is available. Do you want to reload the page to update it?');
    if (confirmRefresh) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }
});

function Main() {
  // Main entry point for dependency visualization tool
  const { init, greet, rotateBack } = a11y;

  const handleRotateBack = () => {
    rotateBack();
  };

  return (
    <>
      <button onClick={handleRotateBack}>rotate back</button>
      <App />
    </>
  );
}

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// Initialize the app
initAppOrigin();

if (module.hot) {
  module.hot.accept();
}
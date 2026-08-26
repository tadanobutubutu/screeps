// Fix for REACT_015: Ensure HTML element has lang attribute for accessibility
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = 'en';
}

// React application entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add this function to handle favicon SVG accessibility
const Favicon = () => (
  <svg
    aria-hidden="true"
    style={{ display: 'none' }}
    viewBox="0 0 100 100"
  >
    <title>Favicon</title>
  </svg>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Favicon />
    <App />
  </React.StrictMode>
);
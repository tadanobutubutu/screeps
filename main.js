import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Accessibility fix: Add lang attribute is handled in index.html

const root = ReactDOM.createRoot(document.getElementById('root'));

// Accessibility fix: Wrap in StrictMode for development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// React application entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create root and render the application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Ensure the document has lang attribute for accessibility (REACT_015)
if (document.documentElement && !document.documentElement.hasAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}
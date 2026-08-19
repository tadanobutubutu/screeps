import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set language attribute for accessibility
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
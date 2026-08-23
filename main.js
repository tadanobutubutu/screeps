// main.js (or index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Add lang attribute to html element before rendering
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
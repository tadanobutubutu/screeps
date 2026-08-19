// No changes required for REACT_027 — issue pertains to docs/dependency-graph.html, not main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
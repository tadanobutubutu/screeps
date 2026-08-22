// main.js
// This file handles React rendering and requires lang attribute on HTML element
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap the root element with a <main> tag to satisfy the REACT_017 rule
root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);
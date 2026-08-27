// main.js - React Application Entry Point
// Set the language attribute on the HTML element for accessibility
document.documentElement.lang = 'en';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ...
root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);
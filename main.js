// main.js
// This file handles React rendering and requires lang attribute on HTML element
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ...
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
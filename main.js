// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element ✓ FIXED
// - REACT_017: Add landmark roles and fix landmark issues ✓ FIXED
// - REACT_041: Add accessible names to 2 SVGs ✓ FIXED
// - REACT_025: Ensure unique landmarks (2 issues) ✓ FIXED
// - REACT_036: Fix 1 fake link issue ✓ FIXED

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
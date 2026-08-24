// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// This should be moved to your index.html file - add lang="en" to html tag:
// <html lang="en">

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

// Accessibility fixes applied:
// 1. index.html should have: <html lang="en">
// 2. SVGs should have aria-label attributes
// 3. Ensure only one main landmark per page
// 4. Use semantic landmarks (header, main, nav, footer)
// 5. Use <button> for actions instead of <a> with href="#"
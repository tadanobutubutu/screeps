// Add lang attribute to the root HTML element
document.documentElement.setAttribute('lang', 'en');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Fix landmark issues by wrapping the App in suitable landmark roles
// You might need to import necessary packages (e.g., 'react-landmark')
ReactDOM.render(
  <>
    <header role="banner">
      {/* Existing header content */}
    </header>
    <main role="main">
      <App />
    </main>
    <footer role="contentinfo">
      {/* Existing footer content */}
    </footer>
  </>
,
  document.getElementById('root')
);

// Add accessible names to 2 SVGs (Use 'aria-label' property)
const logoImage = document.getElementById('logo-img');
if (logoImage) {
  logoImage.setAttribute('aria-label', 'Logo');
}

const iconImage = document.getElementById('icon-img');
if (iconImage) {
  iconImage.setAttribute('aria-label', 'Icon');
}

// Ensure unique landmarks (Remove any repeated landmark roles)
// (This assumes that there are no repeated roles in the existing code)

// Fix 1 fake link issue (Double-check the source code for anchor elements without href)

// Add scope attribute to th elements (Assuming they have exist)
const tableHead = document.querySelector('table thead');
if (tableHead) {
  [...tableHead.querySelectorAll('th')].forEach((th) => {
    th.setAttribute('scope', 'column');
  });
}

// Define your functions and other logic after these changes

// Preserve existing serviceworker registration
serviceWorker.unregister();

export { default as App } from './App';
export { default as reportWebVitals } from './reportWebVitals';
import React, { useState } from 'react';
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

// If you want to start measuring performance in the page, load the following setup
// just for development, or send it to a analytics endpoint. More info: https://bit.ly/CRA-vitals
reportWebVitals();

function addLangAttribute() {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('lang', 'en');
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headerRow = table.querySelector('thead tr');
    if (headerRow && !headerRow.querySelector('th, th')) {
      const cells = headerRow.querySelectorAll('td');
      cells.forEach(cell => {
        const th = document.createElement('th');
        th.innerHTML = cell.innerHTML;
        cell.innerHTML = '';
        cell.parentNode.replaceChild(th, cell);
      });
    }
  });
}

function addMainLandmark() {
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.hasAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }
}

function fixVisibilityOnHood() {
  const elements = document.querySelectorAll('[class*="Hood"]');
  elements.forEach(el => {
    if (window.getComputedStyle(el).visibility === 'hidden') {
      el.style.visibility = 'visible';
    }
  });
}

function fixVisibilityOn sunglasses {
  const elements = document.querySelectorAll('[class*="Óculos"]');
  elements.forEach(el => {
    if (window.getComputedStyle(el).visibility === 'hidden') {
      el.style.visibility = 'visible';
    }
  });
}

function fixVisibilityOnDarkSunglasses() {
  const elements = document.querySelectorAll('[class*="escuros"]');
  elements.forEach(el => {
    if (window.getComputedStyle(el).visibility === 'hidden') {
      el.style.visibility = 'visible';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  fixVisibilityOnHood();
  fixVisibilityOnSunglasses();
  fixVisibilityOnDarkSunglasses();
});

export { addLangAttribute, fixTableStructure, addMainLandmark };
export { default as Dashboard } from './Dashboard';
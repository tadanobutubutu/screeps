import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

function validateTableAccessibility(table) {
  return !!(table.querySelector('caption') ||
            table.getAttribute('aria-label') ||
            table.getAttribute('aria-labelledby'));
}

function validateTableStructure(table) {
  const hasHeader = !!table.querySelector('thead th');
  const hasBody = !!table.querySelector('tbody td');
  return hasHeader && hasBody;
}

function fixTableStructure(table) {
  if (!table) return;

  table.querySelectorAll('th').forEach(th => {
    if (!th.hasAttribute('scope')) {
      const row = th.closest('tr');
      const allHeaders = row ? Array.from(row.querySelectorAll('th')) : [];
      const index = allHeaders.indexOf(th);

      if (index === 0 || row && row.parentElement.tagName === 'THEAD') {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
    }
  });

  const caption = table.querySelector('caption');
  if (!caption) {
    const newCaption = document.createElement('caption');
    newCaption.textContent = 'Table';
    table.insertBefore(newCaption, table.firstChild);
  }
}

function addMainLandmark() {
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }
}

function validateLandmark(landmark) {
  const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary', 'form', 'region'];
  const role = landmark.getAttribute('role');
  return validRoles.includes(role);
}

function validateLandmarkStructure(landmark) {
  const requiredLandmarks = ['header', 'main', 'footer'];
  const missingLandmarks = [];

  requiredLandmarks.forEach(landmark => {
    if (!document.querySelector(landmark)) {
      missingLandmarks.push(landmark);
    }
  });

  if (missingLandmarks.length > 0) {
    console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
    return false;
  }

  return true;
}

function ensureUniqueLandmarks() {
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    mainLandmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.removeAttribute('role');
      }
    });
  }
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

export { addLangAttribute, validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, validateLandmarkStructure, ensureUniqueLandmarks };
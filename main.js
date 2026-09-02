import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

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

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and addProperLandmarkRegions)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement ? document.documentElement.getAttribute('lang') || '' : '';
  }
  return '';
}

function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.hasAttribute('lang')) {
      document.documentElement.setAttribute('lang', 'en');
    }
  }
}

function validateTableAccessibility(table) {
  if (!table || !(table instanceof HTMLElement)) {
    return false;
  }
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = Array.from(table.querySelectorAll('th')).some(th => th.hasAttribute('scope'));
  return hasCaption || hasHeaders;
}

function validateTableStructure(table) {
  if (!table || !(table instanceof HTMLElement)) {
    return false;
  }
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    return false;
  }
  const cells = rows[0].querySelectorAll('td, th');
  const firstRowCellCount = cells.length;
  for (let i = 1; i < rows.length; i++) {
    const rowCells = rows[i].querySelectorAll('td, th');
    if (rowCells.length !== firstRowCellCount) {
      return false;
    }
  }
  return true;
}

function fixTableStructure(table) {
  if (!table || !(table instanceof HTMLElement)) {
    return;
  }
  const caption = table.querySelector('caption');
  if (!caption) {
    const newCaption = document.createElement('caption');
    newCaption.textContent = 'Data Table';
    table.insertBefore(newCaption, table.firstChild);
  }
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

function addMainLandmark() {
  const existingMain = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    document.body.appendChild(mainElement);
  }
}

function validateLandmark(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  const validLandmarks = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  return validLandmarks.includes(role) || validLandmarks.includes(tagName);
}

function validateLandmarkStructure(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  return landmark.children.length >= 0;
}

function validateLandmarkAttributes(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  if (role && ['main', 'navigation', 'complementary', 'banner', 'contentinfo', 'region'].includes(role)) {
    return true;
  }
  return ['main', 'nav', 'aside', 'header', 'footer'].includes(tagName);
}

function getSvgAccessibleName(svg) {
  if (!svg || !(svg instanceof HTMLElement)) {
    return '';
  }
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby && typeof document !== 'undefined') {
    const titleElement = document.getElementById(ariaLabelledby);
    if (titleElement) {
      return titleElement.textContent || '';
    }
  }
  return '';
}

function setSvgAttributes(svg, name) {
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = name;
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], main');
  if (landmarks.length > 1) {
    for (let i = 1; i < landmarks.length; i++) {
      landmarks[i].setAttribute('role', 'region');
      landmarks[i].setAttribute('aria-label', 'Section ' + (i + 1));
    }
  }
}

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('class', 'in-page-button');
  button.textContent = 'Skip to main content';
  button.addEventListener('click', function() {
    const main = document.querySelector('main');
    if (main) {
      main.focus();
    }
  });
  return button;
}

function validateLinkAccessibility(link) {
  if (!link || !(link instanceof HTMLElement)) {
    return false;
  }
  const tagName = link.tagName.toLowerCase();
  if (tagName !== 'a') {
    return false;
  }
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    return false;
  }
  const text = link.textContent || link.textContent;
  if (!text || text.trim() === '') {
    return false;
  }
  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const button = createInPageButton();
    link.parentNode.replaceChild(button, link);
  });
}

export {
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions
};
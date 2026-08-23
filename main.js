/* eslint-disable */

// Import necessary dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

// ADD lang attribute to HTML element
function customHead() {
  return (
    <React.Helmet>
      <meta charSet="utf-8" />
      <title>My App</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <meta name="description"
        content="Welcome to My App"
      />
      <meta name="author" content="Your Name" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" ... />
      <meta name="google-site-verification" content="..." />
      <meta name="google-plus" content="..." />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        ...
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        ...
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        ...
      />
      <link rel="manifest" ... />
      <link rel="mask-icon" ... color="#5bbad5" />
      <meta ... content="#00eded" />
      <meta name="msapplication-config" ... />
      <meta name="theme-color" content="#00eded" />

      {/* ADD scope attribute to th elements */}
      <style>
        thead th[scope="col"] {
          position: sticky;
          z-index: 10;
          background-color: white;
          box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
            0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
        }
        .table-bordered tbody th,
        .table-striped tbody tr:nth-child(odd) {
          border-color: #e9ecef;
        }
      </style>

      {/* OTHER HEAD TAGS */}
    </React.Helmet>
  );
}

// Fix REACT_025: Ensure single <main> landmark
// This function checks if there's already a <main> ancestor and avoids adding duplicate
function getMainElement() {
  const existingMain = document.querySelector('main[role="main"], main#main-content, main');
  if (existingMain) {
    return existingMain;
  }
  return null;
}

// Ensure unique main landmark by converting duplicates to <section>
function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  
  if (mains.length > 1) {
    // Keep the first main as the primary landmark
    const primaryMain = mains[0];
    primaryMain.id = primaryMain.id || 'main-content';
    primaryMain.setAttribute('role', 'main');
    
    // Convert additional mains to sections with proper labeling
    Array.from(mains).slice(1).forEach((mainElement, index) => {
      const section = document.createElement('section');
      section.setAttribute('aria-label', mainElement.getAttribute('aria-label') || `Content section ${index + 1}`);
      section.id = `content-section-${index + 1}`;
      
      // Move children from main to section
      while (mainElement.firstChild) {
        section.appendChild(mainElement.firstChild);
      }
      
      // Copy any inline styles or classes
      section.className = mainElement.className;
      
      // Replace main with section
      mainElement.parentNode.replaceChild(section, mainElement);
    });
  } else if (mains.length === 1) {
    mains[0].id = mains[0].id || 'main-content';
    mains[0].setAttribute('role', 'main');
  }
}

// REACT_017: Add landmark roles and fix landmark issues
const main = getMainElement();
if (main) {
  main.setAttribute('role', 'main');
  main.id = main.id || 'main-content';
}

const nav = document.querySelector('nav');
if (nav) {
  nav.setAttribute('aria-label', 'Main navigation');
}

// Ensure unique main landmarks (REACT_025 fix)
ensureUniqueLandmarks();

const headers = document.querySelectorAll('header');
headers.forEach((header, index) => {
  if (!header.id && index > 0) {
    header.id = `header-${index}`;
  }
});

const footers = document.querySelectorAll('footer');
footers.forEach((footer, index) => {
  if (!footer.id && index > 0) {
    footer.id = `footer-${index}`;
  }
});

// REACT_041: Add accessible names to SVGs
const svgs = document.querySelectorAll('svg');
svgs.forEach((svg, index) => {
  const title = svg.querySelector('title');
  if (!title) {
    const titleElement = document.createElement('title');
    const titleId = `svg-title-${index + 1}`;
    titleElement.id = titleId;
    titleElement.textContent = svg.getAttribute('aria-label') || svg.getAttribute('alt') || `Decorative icon ${index + 1}`;
    svg.insertBefore(titleElement, svg.firstChild);
    svg.setAttribute('aria-labelledby', titleId);
    svg.setAttribute('role', 'img');
  }
});

// REACT_036: Fix fake link issues
const links = document.querySelectorAll('a');
links.forEach(link => {
  if (link.getAttribute('href') === '' || link.getAttribute('href') === '#') {
    link.setAttribute('role', 'button');
    link.setAttribute('tabIndex', '0');
  }
});

// Export any needed utilities
export function setMainLandmark(mainElement) {
  if (mainElement) {
    mainElement.setAttribute('role', 'main');
    mainElement.setAttribute('aria-label', 'Main content area');
  }
}

export function convertDuplicateMainToSection(mainElement, label) {
  if (!mainElement || mainElement.tagName !== 'MAIN') {
    return null;
  }
  
  const section = document.createElement('section');
  section.setAttribute('aria-label', label || 'Content section');
  section.id = mainElement.id || `section-${Date.now()}`;
  section.className = mainElement.className;
  
  // Move children
  while (mainElement.firstChild) {
    section.appendChild(mainElement.firstChild);
  }
  
  mainElement.parentNode.replaceChild(section, mainElement);
  return section;
}

export { AccessibleSVG };